import { IsOptional, IsString } from 'class-validator';
import { User } from '@database/entities/user.entity';
import { Vehicle } from '@database/entities/vehicle.entity';
import { Municipality } from '@database/entities/municipality.entity';
import { TicketHistory } from '@database/entities/ticket-history.entity';
import { Appeal } from '@database/entities/appeal.entity';
import { Violation } from '@database/entities/ticket.entity';
import { TicketStatusModel } from '../../../../../../models/ticket-status.model';

export class CreateTicketDto {
    @IsString()
    citationNo: string;

    user: User;

    @IsOptional()
    violation: Violation;

    @IsOptional()
    status?: TicketStatusModel;

    @IsOptional()
    details?: any;

    @IsOptional()
    vehicle?: Vehicle;

    @IsOptional()
    municipality?: Municipality;

    @IsOptional()
    ticketHistory?: TicketHistory[];

    @IsOptional()
    appeals?: Appeal[];
}
