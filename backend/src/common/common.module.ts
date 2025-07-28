import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { PricingService } from './pricing.service';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: config.get<string>('MAIL_FROM') || 'no-reply@sendit.com',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PrismaService, MailService, PricingService],
  exports: [PrismaService, MailerModule, MailService, PricingService],
})
export class CommonModule {} 