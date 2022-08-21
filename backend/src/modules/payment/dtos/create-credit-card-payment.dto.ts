import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Appeal } from '@database/entities/appeal.entity';
import { CreditCardPaymentStatus } from '@database/entities/credit-card-payment.entity';

export class CreateCreditCardPaymentDto {
    @IsNumber()
    amount?: number;

    @IsString()
    @IsOptional()
    details?: any;

    appeal?: Appeal;

    status?: CreditCardPaymentStatus;
}
