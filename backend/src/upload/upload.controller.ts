import { Controller, Post, Param, UploadedFile, UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request as ExpressRequest } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/profile-photo')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadProfilePhoto(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ExpressRequest & { user: { userId: string } },
  ) {
    return this.uploadService.uploadProfilePhoto(file, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/parcels/:id/delivery-image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadDeliveryImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ExpressRequest & { user: { userId: string; role: string } },
  ) {
    return this.uploadService.uploadDeliveryImage(id, file, req.user);
  }
}
