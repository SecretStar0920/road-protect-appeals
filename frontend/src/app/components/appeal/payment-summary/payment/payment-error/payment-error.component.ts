import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-payment-error',
    templateUrl: './payment-error.component.html',
    styleUrls: ['./payment-error.component.scss'],
})
export class PaymentErrorComponent implements OnInit {
    @Output() goBack: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit() {}

    onGoBack() {
        this.goBack.emit(true);
    }
}
