import { LoggerService } from '@logger';
import { Module } from '@nestjs/common';
import { GetVehicleService } from './services/get-vehicle.service';
import { EditVehicleService } from './services/edit-vehicle.service';

@Module({
    providers: [LoggerService, GetVehicleService, EditVehicleService],
    exports: [GetVehicleService, EditVehicleService],
})
export class VehicleModule {}
