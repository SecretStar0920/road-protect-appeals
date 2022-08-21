import { LoggerService } from '@logger';
import { Module } from '@nestjs/common';
import { PostmarkService } from '../../services/postmark.service';
import { EmailService } from '../email/services/email.service';
import { ContactUsController } from './controllers/contact-us.controller';
import { ContactUsService } from './services/contact-us.service';

@Module({
    controllers: [ContactUsController],
    providers: [ContactUsService, LoggerService, PostmarkService, EmailService],
})
export class ContactUsModule {}
