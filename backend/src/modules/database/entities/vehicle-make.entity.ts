import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { VehicleModel } from '@database/entities/vehicle-model.entity';

@Entity()
export class VehicleMake extends TimeStamped {
    @PrimaryColumn({
        type: 'text',
    })
    vehicleMake: string;

    @OneToMany(type => VehicleModel, vehicleModel => vehicleModel.vehicleMake)
    vehicleModels: VehicleModel[];
}
