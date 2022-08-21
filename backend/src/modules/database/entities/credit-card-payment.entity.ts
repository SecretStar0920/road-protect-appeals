import { Column, ChildEntity } from 'typeorm';
import { Payment } from '@database/entities/payment.entity';

export enum CreditCardPaymentStatus {
    PENDING = 'PENDING',
    SUBMITTED = 'SUBMITTED',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

@ChildEntity()
export class CreditCardPayment extends Payment {
    @Column('enum', { enum: CreditCardPaymentStatus })
    status: CreditCardPaymentStatus;
}
