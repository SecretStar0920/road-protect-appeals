import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from '@logger';
import { Ticket } from '@database/entities/ticket.entity';
import { CreateTicketHistoryDto } from '../dtos/create-ticket-history.dto';
import { LogChannel } from '../../../../../../config/logs';
import { TicketActions, TicketHistory, TicketInterface } from '@database/entities/ticket-history.entity';

@Injectable()
export class UpdateTicketHistoryService {
    constructor(private logger: LoggerService) {}

    private async create(dto: CreateTicketHistoryDto): Promise<TicketHistory> {
        const fnc = this.create.name;
        this.logger.debug(
            LogChannel.TICKET_HISTORY,
            `Creating local ticket history for [${dto.action}] ticket roadProtectId: [${dto.ticket.ticketId}]`,
            fnc,
        );
        const ticketHistory = TicketHistory.create(dto);

        try {
            await ticketHistory.save();
            this.logger.debug(LogChannel.TICKET, `Successfully created local ticket history`, fnc);
            return ticketHistory;
        } catch (e) {
            this.logger.debug(LogChannel.TICKET_HISTORY, `Failed to create ticket history: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            throw new InternalServerErrorException('Failed to create ticket history.');
        }
    }

    async toTicketInterface(ticket: Ticket) {
        const ticketInterface: TicketInterface = {
            ticketId: ticket.ticketId,
            citationNo: ticket.citationNo,
            violation: ticket.violation,
            status: ticket.status,
            details: ticket.details,
            user: ticket.user,
            vehicle: ticket.vehicle,
            municipality: ticket.municipality,
            appeals: ticket.appeals,
        };
        return ticketInterface;
    }

    async createTicket(ticket: Ticket) {
        const ticketHistory: CreateTicketHistoryDto = {
            action: TicketActions.CREATED,
            citationNo: ticket.citationNo,
            updatedTicket: ticket,
            ticket,
        };
        return await this.create(ticketHistory);
    }

    async editTicket(oldTicket: TicketInterface, newTicket: TicketInterface) {
        const ticketHistory: CreateTicketHistoryDto = {
            action: TicketActions.EDITED,
            citationNo: newTicket.citationNo ? newTicket.citationNo : '',
            previousTicket: oldTicket,
            updatedTicket: newTicket,
            ticket: newTicket as Ticket,
        };
        return await this.create(ticketHistory);
    }

    // TODO: link to payments - will qualify as appealed once paid for
    async appealTicket(oldTicket: TicketInterface, newTicket: TicketInterface) {
        const ticketHistory: CreateTicketHistoryDto = {
            action: TicketActions.APPEALED,
            citationNo: newTicket.citationNo ? newTicket.citationNo : '',
            previousTicket: oldTicket,
            updatedTicket: newTicket,
            ticket: newTicket as Ticket,
        };
        return await this.create(ticketHistory);
    }

    async deletedTicket(oldTicket: TicketInterface, newTicket: TicketInterface) {
        const ticketHistory: CreateTicketHistoryDto = {
            action: TicketActions.DELETED,
            citationNo: newTicket.citationNo ? newTicket.citationNo : '',
            previousTicket: oldTicket,
            updatedTicket: newTicket,
            ticket: newTicket as Ticket,
        };
        return await this.create(ticketHistory);
    }
}
