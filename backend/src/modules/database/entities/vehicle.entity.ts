import { Entity, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { VehicleModel } from '@database/entities/vehicle-model.entity';
import { Ticket } from '@database/entities/ticket.entity';

@Entity()
export class Vehicle extends TimeStamped {
    @PrimaryColumn({
        type: 'text',
    })
    vehicleRegistration: string;

    @ManyToOne(type => VehicleModel, vehicleModel => vehicleModel.vehicles, { nullable: false })
    @JoinColumn([{ name: 'vehicleModelId', referencedColumnName: 'vehicleModelId' }])
    vehicleModel: VehicleModel;

    @OneToMany(type => Ticket, ticket => ticket.vehicle, { nullable: true })
    tickets: Ticket[];
}
