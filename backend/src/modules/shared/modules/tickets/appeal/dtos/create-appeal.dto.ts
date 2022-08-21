import { IsNumber, IsOptional } from 'class-validator';
import { AppealDetails } from '@database/entities/appeal.entity';
import { Expose } from 'class-transformer';

export class CreateAppealDto {
    @IsNumber()
    customerId: number;

    @IsOptional()
    @Expose()
    details?: AppealDetails;
}
