import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { find } from 'lodash';
import { LogChannel } from '../config/logs';
import { TicketStatusModel } from '../models/ticket-status.model';
import { ZaService } from './za/za.service';

@Injectable()
export class GetTicketStatusNameService {
    private ticketStatusList: TicketStatusModel[];

    constructor(private zaService: ZaService, private logger: LoggerService) {}

    async getTicketStatusName(ticketStatusId: number, request: Request): Promise<string> {
        const fnc = this.getTicketStatusName.name;

        if (!this.ticketStatusList) {
            this.logger.info(LogChannel.ZA, 'Retrieving ticket status list', fnc);
            const ticketStatusList = await this.zaService.getTicketStatus(request);

            if (ticketStatusList instanceof Error) {
                this.logger.error(
                    LogChannel.ZA,
                    `Could not find ticket status name for ticket status id ${ticketStatusId}`,
                    fnc,
                    ticketStatusList,
                );
                return '';
            }
            this.ticketStatusList = ticketStatusList;
        }

        const statusMatch = find(this.ticketStatusList, status => status.id === ticketStatusId);

        if (!statusMatch) {
            this.logger.error(
                LogChannel.ZA,
                `Could not find ticket status name for ticket status id ${ticketStatusId}`,
                fnc,
                this.ticketStatusList,
            );
            return '';
        }
        return statusMatch.name;
    }
}
