import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { TicketService } from '../services/ticket.service';

@Injectable()
export class TicketsResolver implements Resolve<any> {
    constructor(
        private readonly crudService: CrudService,
        private readonly ticketService: TicketService,
        private readonly router: Router,
    ) {}

    async resolve() {
        const tickets = await this.crudService.getTicketHistory();
        if (tickets.length) {
            return tickets;
        }
        const customerId = this.ticketService.userInfo.get('id').value;
        const ticket = await this.crudService.addTicket(customerId);
        this.ticketService.updateTicket(ticket);
        this.router.navigate(['appeal', 'fine']);
    }
}
