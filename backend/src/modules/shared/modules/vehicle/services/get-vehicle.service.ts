import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { VehicleMake } from '@database/entities/vehicle-make.entity';
import { VehicleModel } from '@database/entities/vehicle-model.entity';
import { Vehicle } from '@database/entities/vehicle.entity';

@Injectable()
export class GetVehicleService {
    constructor(private logger: LoggerService) {}

    async getVehicleMake(vehicleMake: string): Promise<VehicleMake | undefined> {
        return VehicleMake.createQueryBuilder('vehicleMake')
            .where('vehicleMake."vehicleMake" = :vehicleMake', { vehicleMake })
            .getOne();
    }

    async getVehicleModel(vehicleModel: string, vehicleMake: string): Promise<VehicleModel | undefined> {
        return VehicleModel.createQueryBuilder('model')
            .where('model."vehicleModel" = :vehicleModel', { vehicleModel })
            .andWhere('model."vehicleMakeName" = :vehicleMake', { vehicleMake })
            .getOne();
    }
    async getVehicleByRegistration(vehicleRegistration: string): Promise<Vehicle | undefined> {
        return Vehicle.createQueryBuilder('vehicle')
            .where('vehicle."vehicleRegistration" = :vehicleRegistration', { vehicleRegistration })
            .getOne();
    }
}
