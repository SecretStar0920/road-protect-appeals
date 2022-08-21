import { IsOptional, IsString } from 'class-validator';
import { Vehicle } from '@database/entities/vehicle.entity';
import { Municipality } from '@database/entities/municipality.entity';
import { TicketHistory } from '@database/entities/ticket-history.entity';
import { Appeal } from '@database/entities/appeal.entity';
import { TicketStatusModel } from '../../../../../../models/ticket-status.model';
import { Moment } from 'moment';

export class EditTicketDto {
    @IsOptional()
    @IsString()
    citationNo?: string;

    @IsOptional()
    @IsString()
    violationCode?: string;

    @IsOptional()
    @IsString()
    violationDate?: string;

    @IsOptional()
    @IsString()
    violationAmount?: string;

    @IsOptional()
    status?: TicketStatusModel;

    @IsOptional()
    details?: any;

    @IsOptional()
    vehicle?: Vehicle;

    @IsOptional()
    deletedAt?: Moment;

    @IsOptional()
    municipality?: Municipality;

    @IsOptional()
    ticketHistory?: TicketHistory[];

    @IsOptional()
    appeals?: Appeal[];
}
