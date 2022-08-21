import { LoggerService } from '@logger';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import { LogChannel } from '../../../config/logs';
import { PaymentSuccessRequest } from '../../../dto/payment-success-request.dto';

@Injectable()
export class SuccessfulPaymentService implements OnModuleInit {
    private successTemplate: string;

    constructor(private logger: LoggerService) {}

    async onModuleInit(): Promise<void> {
        this.successTemplate = await fs
            .readFile(path.resolve(__dirname, '../templates/successful-payment.hbs'))
            .then(template => template.toString());
    }

    handle(query: PaymentSuccessRequest): string {
        const fnc = `${this.handle.name}_success`;
        this.logger.debug(LogChannel.PAYMENT, `Successful payment made`, fnc, query);
        const template = Handlebars.compile(this.successTemplate);
        return template({ query });
    }
}
