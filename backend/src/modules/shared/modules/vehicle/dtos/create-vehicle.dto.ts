import { IsString } from 'class-validator';
import { Ticket } from '@database/entities/ticket.entity';
import { VehicleModel } from '@database/entities/vehicle-model.entity';

export class CreateVehicleDto {
    @IsString()
    vehicleRegistration: string;

    vehicleModel: VehicleModel;
}
