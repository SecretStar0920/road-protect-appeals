import { IsString } from 'class-validator';
import { Ticket } from '@database/entities/ticket.entity';
import { TicketActions, TicketInterface } from '@database/entities/ticket-history.entity';

export class CreateTicketHistoryDto {
    @IsString()
    citationNo: string;

    action: TicketActions;

    updatedTicket: TicketInterface;

    previousTicket?: TicketInterface;

    ticket: Ticket;
}
