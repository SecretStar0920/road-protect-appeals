import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayByCreditCardComponent } from './pay-by-credit-card.component';

describe('PayByCreditCardComponent', () => {
    let component: PayByCreditCardComponent;
    let fixture: ComponentFixture<PayByCreditCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PayByCreditCardComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PayByCreditCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
