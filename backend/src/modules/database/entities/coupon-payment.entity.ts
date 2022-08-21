import { Column, ChildEntity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Payment } from '@database/entities/payment.entity';
import { Coupon } from '@database/entities/coupon.entity';

export enum CouponPaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

@ChildEntity()
export class CouponPayment extends Payment {
    @Column('enum', { enum: CouponPaymentStatus })
    status: CouponPaymentStatus;

    @ManyToOne(type => Coupon, coupon => coupon.couponPayments, { nullable: true })
    @JoinColumn({ name: 'couponId', referencedColumnName: 'couponId' })
    @Index()
    coupon: Coupon;
}
