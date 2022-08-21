import { Injectable } from '@nestjs/common';
import { Client, Message, Attachment, TemplatedMessage } from 'postmark';
import config from '../config';
import { LogChannel } from '../config/logs';
import { LoggerService } from '@logger';

interface ITemplateModel {
    [key: string]: string | { [key: string]: any };
}

@Injectable()
export class PostmarkService {
    private readonly client: Client;

    constructor(private logger: LoggerService) {
        if (config.postmark.token) {
            this.client = new Client(config.postmark.token);
        }
    }

    public createPDFAttachment(citationNo: string, buffer: string): Attachment {
        const fnc = this.createPDFAttachment.name;
        this.logger.debug(LogChannel.POSTMARK, `Creating a PDF attachment for citation ${citationNo}`, fnc, citationNo);
        return new Attachment(`Appeal_Report_${citationNo}.pdf`, buffer, 'application/octet-stream');
    }

    public createImageAttachment(name: string, buffer: string, mimeType: string, fileName: string): Attachment {
        const fnc = this.createImageAttachment.name;
        this.logger.debug(LogChannel.POSTMARK, `Creating an attachment for file ${name}`, fnc, {
            name,
            mimeType,
            fileName,
        });
        return new Attachment(name, buffer, `image/${mimeType}`, `cid:${fileName}`);
    }

    public composeMessage(
        citationNo: string,
        htmlBody: string,
        to: string,
        attachments: Attachment[],
        subject?: string,
        cc?: string,
        bcc?: string,
    ): Message {
        const fnc = this.composeMessage.name;
        const { from } = config.postmark;
        const _subject = subject ? subject : `בקשה לביטול דוח ${citationNo}`;

        this.logger.debug(LogChannel.POSTMARK, `Composing a message`, fnc, {
            citationNo,
            to,
            from,
            subject: _subject,
        });

        return new Message(
            from,
            _subject,
            htmlBody,
            undefined,
            to,
            cc,
            bcc,
            undefined,
            'Receipt',
            undefined,
            undefined,
            undefined,
            attachments,
            undefined,
        );
    }

    public composeTemplatedMessage(
        from: string,
        to: string,
        attachments: Attachment[],
        templateModel: ITemplateModel,
    ): TemplatedMessage {
        const fnc = this.composeTemplatedMessage.name;
        this.logger.debug(LogChannel.POSTMARK, `Composing a template message`, fnc, {
            from,
            to,
            templateModel,
        });

        return new TemplatedMessage(
            from,
            'rp-customer-template',
            templateModel,
            to,
            undefined,
            undefined,
            undefined,
            'Receipt',
            undefined,
            undefined,
            undefined,
            attachments,
        );
    }

    public async sendEmail(message: Message): Promise<boolean> {
        const fnc = this.sendEmail.name;
        this.logger.debug(LogChannel.POSTMARK, `Sending an email`, fnc, message);
        const response = await this.client.sendEmail(message);
        this.logger.debug(LogChannel.POSTMARK, `Received the response`, fnc, response);
        return !!response.MessageID;
    }

    public async sendEmailWithTemplate(message: TemplatedMessage): Promise<boolean> {
        const fnc = this.sendEmailWithTemplate.name;
        this.logger.debug(LogChannel.POSTMARK, `Sending a template email`, fnc, message);
        const response = await this.client.sendEmailWithTemplate(message);
        this.logger.debug(LogChannel.POSTMARK, `Received the response`, fnc, response);
        return !!response.MessageID;
    }
}
