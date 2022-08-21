import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayByCouponComponent } from './pay-by-coupon.component';

describe('PayByCouponComponent', () => {
    let component: PayByCouponComponent;
    let fixture: ComponentFixture<PayByCouponComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PayByCouponComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PayByCouponComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
