import { IsOptional, IsString } from 'class-validator';
import { CourthouseModel } from '../../../../../models/courthouse.model';
import { Ticket } from '@database/entities/ticket.entity';

export class CreateMunicipalityDto {
    @IsString()
    cityCode: string;

    @IsString()
    cityName: string;

    @IsOptional()
    courthouseRP: CourthouseModel;
    tickets: Ticket[];
}
