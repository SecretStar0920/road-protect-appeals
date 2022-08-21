import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/crud.service';
import { TicketModel } from 'src/app/core/models/ticket.model';
import { ImgPathService } from 'src/app/core/services/img-path.service';
import { AuthService } from '../../../core/services/auth.service';
import { TicketService } from '../../../core/services/ticket.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-ticket-selection',
    templateUrl: './ticket-selection.component.html',
    styleUrls: ['./ticket-selection.component.scss'],
})
export class TicketSelectionComponent implements OnInit {
    loadingTickets: boolean;
    public tickets: TicketModel[] = [];
    public ticketStatusList: { [key: number]: string } = {};

    public violation = {};

    public previewPdfUrl;

    constructor(
        private readonly crudService: CrudService,
        private readonly authService: AuthService,
        private readonly ticketService: TicketService,
        private readonly router: Router,
        public readonly imgPathService: ImgPathService,
    ) {}

    async ngOnInit() {
        this.ticketService.restartProcess();
        this.loadingTickets = true;
        // Get existing tickets or go to the start fine page
        const tickets = await this.crudService.getTicketHistory();
        // if violations have not been loaded, then get violations from backend
        if (!this.ticketService.violationsData) {
            await this.ticketService.getViolations();
        }
        this.loadingTickets = false;

        if (!tickets) {
            this.authService.logout();
        } else if (tickets.length) {
            this.tickets = tickets;
            this.ticketService.ticketStatusList = await this.crudService.ticketStatusList();
        } else {
            const customerId = this.ticketService.userInfo.get('id').value;
            const ticket = await this.crudService.addTicket(customerId);
            this.ticketService.updateTicket(ticket);
            this.router.navigate(['appeal', 'fine']);
        }
    }

    public get inited(): boolean {
        return Object.keys(this.ticketService.ticketStatusList).length > 0;
    }

    onTicketDeleted(ticketId: number) {
        this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
    }

    public async createNewTicket() {
        try {
            const customerId = this.ticketService.userInfo.get('id').value;
            const ticket = await this.crudService.addTicket(customerId);
            this.ticketService.pics = [];
            this.ticketService.idPic = null;
            this.ticketService.appealPaths = [];
            this.ticketService.updateTicket(ticket);
            this.router.navigate(['appeal', 'fine']);
        } catch (exception) {
            console.error(exception);
        }
    }
}
