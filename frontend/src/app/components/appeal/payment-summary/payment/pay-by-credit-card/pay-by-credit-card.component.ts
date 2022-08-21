import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TicketStatus } from '../../../../../core/enums/ticket-status.enum';
import { CrudService } from '../../../../../core/services/crud.service';
import { TicketService } from '../../../../../core/services/ticket.service';

@Component({
    selector: 'app-pay-by-credit-card',
    templateUrl: './pay-by-credit-card.component.html',
    styleUrls: ['./pay-by-credit-card.component.scss'],
})
export class PayByCreditCardComponent implements OnInit {
    @ViewChild('visaPart1', { static: true }) visaPart1: ElementRef;
    @ViewChild('visaPart2', { static: true }) visaPart2: ElementRef;
    @ViewChild('visaPart3', { static: true }) visaPart3: ElementRef;
    @ViewChild('visaPart4', { static: true }) visaPart4: ElementRef;
    @ViewChild('expirationMonth', { static: true }) expirationMonth: ElementRef;
    @ViewChild('expirationYear', { static: true }) expirationYear: ElementRef;
    @ViewChild('cvvField', { static: true }) cvvField: ElementRef;

    public paymentSuccessful: boolean = false;
    @Input() iframeUrl: string;

    constructor(private readonly ticketService: TicketService, private readonly crudService: CrudService) {}

    ngOnInit() {
        const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        const eventer = window[eventMethod];
        const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

        // Listen to message from child window
        eventer(
            messageEvent,
            async e => {
                try {
                    if (this.paymentSuccessful) {
                        return;
                    }
                    const key = e.message ? 'message' : 'data';
                    this.paymentSuccessful = e[key] ? e[key].success : false;
                    const referenceNumber = e[key] ? `${e[key].referenceNumber}` : null;
                    this.ticketService.hasPaid = this.paymentSuccessful;

                    if (this.ticketService.hasPaid) {
                        const ticketId = this.ticketService.fine.get('id').value;
                        await this.crudService.updateTicketStatus(
                            TicketStatus.PAID_CREDIT_CARD,
                            ticketId,
                            referenceNumber,
                        );
                    }
                } catch (e) {
                    console.error(`An error has occurred when updating the payment status: ${e.message}`, e);
                }
            },
            false,
        );
    }
}
