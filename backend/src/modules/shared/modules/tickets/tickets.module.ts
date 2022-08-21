import { LoggerService } from '@logger';
import { forwardRef, Module } from '@nestjs/common';
import { GetTicketService } from './ticket/services/get-ticket.service';
import { EditTicketService } from './ticket/services/edit-ticket.service';
import { GetAppealService } from './appeal/services/get-appeal.service';
import { EditAppealService } from './appeal/services/edit-appeal.service';
import { UpdateTicketsService } from './update-tickets.service';
import { UpdateTicketHistoryService } from './ticket/services/update-ticket-history.service';
import { SharedModule } from '../../shared.module';

@Module({
    imports: [forwardRef(() => SharedModule)],
    providers: [
        LoggerService,
        GetTicketService,
        GetAppealService,
        EditTicketService,
        EditAppealService,
        EditTicketService,
        UpdateTicketsService,
        UpdateTicketHistoryService,
    ],
    exports: [
        GetTicketService,
        GetAppealService,
        EditTicketService,
        EditAppealService,
        UpdateTicketsService,
        UpdateTicketHistoryService,
    ],
})
export class TicketsModule {}
