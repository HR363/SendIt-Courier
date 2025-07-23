import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your SendIt account',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <b>${code}</b></p>`,
    });
  }

  async sendPasswordResetEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your SendIt password',
      template: 'forgot-password', // relative to backend/templates
      context: { code },
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to SendIt!',
      template: 'welcome', // relative to backend/templates
      context: { firstName },
    });
  }

  async sendStatusUpdateEmail(email: string, name: string, trackingNumber: string, status: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Parcel Status Update',
      template: 'status-update',
      context: { name, trackingNumber, status },
    });
  }

  async sendDeliveryConfirmationEmail(email: string, name: string, trackingNumber: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Delivery Confirmation',
      template: 'delivery-confirmation',
      context: { name, trackingNumber },
    });
  }
} 