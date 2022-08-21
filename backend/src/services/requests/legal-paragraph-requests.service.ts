import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { MiscApi } from '../../apis/ZA/api/misc-api';
import got from 'got';
import config from '@config';
import { Request } from 'express';
import { logZARequests } from '../../helpers/decorators';
import { LogChannel } from '../../config/logs';
import { IViolations } from '../../models/violations.model';
import { ILegalParagraph } from '../../models/legal-paragraph.model';

@Injectable()
export class LegalParagraphRequestsService {
    private readonly _zaApi: MiscApi;
    constructor(private logger: LoggerService) {
        this._zaApi = new MiscApi(config.za.host);
    }

    @logZARequests
    async getLegalParagraphs(ticketId, headers: any = {}): Promise<ILegalParagraph[]> {
        const fnc = this.getLegalParagraphs.name;
        const url = this._zaApi.basePath + '/Ticket/getTicketDefenceParagraphs';
        const options: any = {};
        options.headers = headers;
        options.searchParams = { ticketId };

        this.logger.debug(LogChannel.ZA, `Retrieving legal paragraphs for ticket ${ticketId}`, fnc, url);
        try {
            const result: { data: ILegalParagraph[] } = await got.get(url, options).json();

            this.logger.debug(LogChannel.ZA, `Received legal paragraphs`, fnc, result.data);

            return result.data;
        } catch (exception) {
            this.logger.error(LogChannel.ZA, `Failed to get legal paragraphs for ticket ${ticketId}`, fnc, {
                body: exception.body ? exception.body.error : exception,
                stack: exception.stack,
            });
            throw new Error(exception.body ? exception.body : exception);
        }
    }
}
