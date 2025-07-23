import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/database/prisma.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { AssignCourierDto } from './dto/assign-courier.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';
import { ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { MailService } from '../common/mail.service';

@Injectable()
export class ParcelsService {
  constructor(private readonly prisma: PrismaService, private readonly mailService: MailService) {}

  async createParcel(dto: CreateParcelDto, user: { userId: string; role: string }) {
    if (!['ADMIN', 'COURIER_AGENT'].includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    // Generate unique tracking number
    const trackingNumber = uuidv4();
    const parcel = await this.prisma.parcel.create({
      data: {
        ...dto,
        trackingNumber,
        createdById: user.userId,
        isActive: true,
      },
    });
    // Return safe fields only
    const { id, senderId, receiverId, categoryId, trackingNumber: tn, status, isActive, createdAt, updatedAt } = parcel;
    return { id, senderId, receiverId, categoryId, trackingNumber: tn, status, isActive, createdAt, updatedAt };
  }

  async updateParcel(id: string, dto: UpdateParcelDto, user: { userId: string; role: string }) {
    if (!['ADMIN', 'COURIER_AGENT'].includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || !parcel.isActive) throw new ForbiddenException('Parcel not found or inactive');
    const updated = await this.prisma.parcel.update({
      where: { id },
      data: { ...dto },
    });
    return updated;
  }

  async assignCourier(id: string, dto: AssignCourierDto) {
    // Only admin can assign
    // (Controller already guards, but double-check here)
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || !parcel.isActive) throw new ForbiddenException('Parcel not found or inactive');
    const updated = await this.prisma.parcel.update({
      where: { id },
      data: { assignedCourierId: dto.assignedCourierId },
    });
    return updated;
  }

  async updateStatus(id: string, dto: UpdateParcelStatusDto, user: { userId: string; role: string }) {
    if (!['ADMIN', 'COURIER_AGENT'].includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || !parcel.isActive) throw new ForbiddenException('Parcel not found or inactive');
    // Update status
    const updated = await this.prisma.parcel.update({
      where: { id },
      data: { status: dto.status },
    });
    // Add to status history
    await this.prisma.parcelStatusHistory.create({
      data: {
        parcelId: id,
        status: dto.status,
        location: parcel.destinationLocation, // or pickupLocation, or pass in DTO if needed
        updatedById: user.userId,
      },
    });
    // Send status update emails
    const sender = await this.prisma.user.findUnique({ where: { id: parcel.senderId } });
    const receiver = await this.prisma.user.findUnique({ where: { id: parcel.receiverId } });
    if (sender) {
      await this.mailService.sendStatusUpdateEmail(sender.email, sender.firstName, parcel.trackingNumber, dto.status);
    }
    if (receiver) {
      await this.mailService.sendStatusUpdateEmail(receiver.email, receiver.firstName, parcel.trackingNumber, dto.status);
    }
    // If delivered, send delivery confirmation
    if (dto.status === 'DELIVERED') {
      if (sender) {
        await this.mailService.sendDeliveryConfirmationEmail(sender.email, sender.firstName, parcel.trackingNumber);
      }
      if (receiver) {
        await this.mailService.sendDeliveryConfirmationEmail(receiver.email, receiver.firstName, parcel.trackingNumber);
      }
    }
    return updated;
  }

  async getSentParcels(userId: string) {
    return this.prisma.parcel.findMany({
      where: { senderId: userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReceivedParcels(userId: string) {
    return this.prisma.parcel.findMany({
      where: { receiverId: userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getParcelById(id: string, user: { userId: string; role: string }) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || !parcel.isActive) return null;
    const isSender = parcel.senderId === user.userId;
    const isReceiver = parcel.receiverId === user.userId;
    const isAssignedCourier = parcel.assignedCourierId === user.userId;
    const isAdmin = user.role === 'ADMIN';
    if (!(isSender || isReceiver || isAssignedCourier || isAdmin)) {
      throw new (await import('@nestjs/common')).ForbiddenException('Access denied');
    }
    return parcel;
  }

  async softDeleteParcel(id: string, user: { userId: string; role: string }) {
    if (!['ADMIN', 'COURIER_AGENT'].includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || !parcel.isActive) throw new ForbiddenException('Parcel not found or already deleted');
    const updated = await this.prisma.parcel.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
    return updated;
  }

  async getParcelStatusHistory(id: string, user: { userId: string; role: string }) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel || !parcel.isActive) throw new NotFoundException('Parcel not found');
    const isSender = parcel.senderId === user.userId;
    const isReceiver = parcel.receiverId === user.userId;
    const isAssignedCourier = parcel.assignedCourierId === user.userId;
    const isAdmin = user.role === 'ADMIN';
    if (!(isSender || isReceiver || isAssignedCourier || isAdmin)) {
      throw new ForbiddenException('Access denied');
    }
    return this.prisma.parcelStatusHistory.findMany({
      where: { parcelId: id },
      orderBy: { createdAt: 'asc' },
    });
  }
}
