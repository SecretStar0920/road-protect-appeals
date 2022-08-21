import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../../../../core/services/crud.service';
import { TicketService } from '../../../../../core/services/ticket.service';

@Component({
    selector: 'app-pay-by-coupon',
    templateUrl: './pay-by-coupon.component.html',
    styleUrls: ['./pay-by-coupon.component.scss'],
})
export class PayByCouponComponent implements OnInit {
    couponValid: boolean;
    submittedCoupon: boolean;
    couponForm: FormGroup;

    constructor(private fb: FormBuilder, private crudService: CrudService, private ticketService: TicketService) {}

    ngOnInit() {
        this.reset();
    }

    reset() {
        this.couponValid = false;
        this.submittedCoupon = false;

        // Coupon code cannot include space
        this.couponForm = this.fb.group({
            coupon: ['', [Validators.required, Validators.pattern(/\S/)]],
        });
    }

    applyCoupon() {
        this.crudService
            .payByCoupon(this.couponForm.get('coupon').value)
            .then(result => {
                this.couponValid = result;
                this.ticketService.hasPaid = true;
            })
            .finally(() => (this.submittedCoupon = true));
    }
}
