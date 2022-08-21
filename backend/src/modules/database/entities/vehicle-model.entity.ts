import { Entity, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index, Column } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { VehicleMake } from '@database/entities/vehicle-make.entity';
import { Vehicle } from '@database/entities/vehicle.entity';

@Entity()
export class VehicleModel extends TimeStamped {
    @PrimaryGeneratedColumn()
    vehicleModelId: number;

    @Column({
        type: 'text',
    })
    vehicleModel: string;

    @Column({
        type: 'text',
    })
    vehicleMakeName: string;

    @ManyToOne(type => VehicleMake, vehicleMake => vehicleMake.vehicleModels, { nullable: false })
    @JoinColumn({ name: 'vehicleMakeName', referencedColumnName: 'vehicleMake' })
    vehicleMake: VehicleMake;

    @OneToMany(type => Vehicle, vehicles => vehicles.vehicleModel, { cascade: true })
    vehicles: Vehicle[];
}
