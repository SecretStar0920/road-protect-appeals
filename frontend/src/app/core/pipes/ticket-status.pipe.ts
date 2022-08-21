import { Pipe, PipeTransform } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { TicketStatus } from '../enums/ticket-status.enum';

@Pipe({
    name: 'ticketStatus',
    pure: true,
})
export class TicketStatusPipe implements PipeTransform {
    constructor(private readonly ticketService: TicketService) {}

    transform(name: string): any {
        if (!Object.keys(this.ticketService.ticketStatusList).length) {
            return '';
        }
        switch (name) {
            case TicketStatus.PENDING:
            case TicketStatus.PENDING_MEMBERSHIP:
                return 'חסרים פרטים';
            case TicketStatus.SENT_TO_MUNICIPALITY:
            case TicketStatus.GUILTY:
            case TicketStatus.DISMISSED:
            case TicketStatus.REFUNDED:
                return 'נשלח לעירייה';
            case TicketStatus.AWAITING_PAYMENT:
            case TicketStatus.NOT_ENGAGING:
                return 'ממתין לתשלום';
            case TicketStatus.PAID_CREDIT_CARD:
            case TicketStatus.PAID_MEMBERSHIP:
                return 'שולם ותרם נשלח';
            default:
                return '';
        }
    }
}
