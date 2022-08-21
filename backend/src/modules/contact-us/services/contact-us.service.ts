import config from '@config';
import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { Message } from 'postmark';
import { LogChannel } from '../../../config/logs';
import { PostmarkService } from '../../../services/postmark.service';
import { EmailTemplate } from '../../email/email-template.enum';
import { EmailService } from '../../email/services/email.service';
import { ContactUsDto } from '../controllers/contact-us.dto';

@Injectable()
export class ContactUsService {
    constructor(
        private logger: LoggerService,
        private emailService: EmailService,
        private postmarkService: PostmarkService,
    ) {}

    async handle(dto: ContactUsDto): Promise<boolean> {
        const fnc = this.handle.name;
        this.logger.debug(LogChannel.CONTACT_US, 'Received a contact us request', fnc, dto);
        const htmlBody = await this.emailService.getTemplate(EmailTemplate.ContactUs, dto);

        const to = config.postmark.mainEmail;
        const from = config.postmark.from;
        const message = new Message(
            from,
            `פנייה חדשה מדף צור קשר`,
            htmlBody,
            undefined,
            to,
            undefined,
            undefined,
            undefined,
            'Receipt',
            undefined,
            undefined,
            undefined,
            [],
            undefined,
        );
        this.postmarkService
            .sendEmail(message)
            .then(result => {
                // Send email to main email with contact information
                this.logger.debug(
                    LogChannel.CONTACT_US,
                    `Successfully forwarded contact information to ${to}`,
                    fnc,
                    dto,
                );
            })
            .catch(e => {
                this.logger.error(LogChannel.CONTACT_US, `Failed to send email`, fnc, {
                    error: e,
                    context: dto,
                    stack: e.stack,
                });
            });
        return true;
    }
}
