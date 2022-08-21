import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/crud.service';
import { ImgPathService } from '../../../../core/services/img-path.service';
import { TicketService } from '../../../../core/services/ticket.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
    paymentUrl: string;
    payByCreditCard: boolean;
    payByCoupon: boolean;

    constructor(
        public readonly imgPathService: ImgPathService,
        private readonly crudService: CrudService,
        private readonly ticketService: TicketService,
    ) {}

    ngOnInit(): void {
        this.resetPaymentOptions();
    }

    resetPaymentOptions() {
        this.paymentUrl = '';
        this.payByCreditCard = false;
        this.payByCoupon = false;
    }

    makeCreditCardPayment() {
        this.crudService.doDeal().then(result => {
            this.paymentUrl = result.url;
            this.payByCreditCard = true;
        });
    }

    makeCouponPayment() {
        this.payByCoupon = true;
    }

    hasPaid(): boolean {
        return this.ticketService.hasPaid;
    }
}
