import { LoggerService } from '@logger';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { LogChannel } from '../../../config/logs';
import { PaymentFailedRequest } from '../../../dto/payment-failed-request.dto';

@Injectable()
export class FailedPaymentService implements OnModuleInit {
    private failedTemplate: string;

    constructor(private logger: LoggerService) {}

    async onModuleInit(): Promise<void> {
        this.failedTemplate = await fs
            .readFile(path.resolve(__dirname, '../templates/failed-payment.hbs'))
            .then(template => template.toString());
    }

    handle(query: PaymentFailedRequest): string {
        const fnc = `${this.handle.name}_failed`;
        this.logger.debug(LogChannel.PAYMENT, `Payment failed`, fnc, query);
        const template = Handlebars.compile(this.failedTemplate);
        return template({ query });
    }
}
