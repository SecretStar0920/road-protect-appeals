import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { User } from '@database/entities/user.entity';
import { Vehicle } from '@database/entities/vehicle.entity';
import { Municipality } from '@database/entities/municipality.entity';
import { TicketHistory } from '@database/entities/ticket-history.entity';
import { Appeal } from '@database/entities/appeal.entity';
import { UpdateTicketRequest } from '../../../apis/ZA/model/update-ticket-request';
import { DateTransformer } from '@database/transformers/date.transformer';
import { Moment } from 'moment';
import { TicketStatusModel } from '../../../models/ticket-status.model';

export interface Violation {
    code: string;
    date: string;
    amount: string;
}

@Entity()
export class Ticket extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    ticketId: number;

    @Column('text', { nullable: true })
    @Index({ unique: true, where: '"deletedAt" IS NULL' })
    citationNo: string;

    @Column('jsonb', { default: {}, nullable: true })
    violation: Violation;

    @Column('jsonb', { default: {}, nullable: true })
    status: TicketStatusModel;

    @Column('jsonb', { default: {}, nullable: true })
    details: Partial<UpdateTicketRequest>;

    @Column('timestamptz', {
        transformer: new DateTransformer(),
        nullable: true,
        default: null,
    })
    deletedAt: Moment;

    @ManyToOne(type => User, user => user.tickets)
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;

    @ManyToOne(type => Vehicle, vehicle => vehicle.tickets)
    @JoinColumn({ name: 'vehicleRegistration', referencedColumnName: 'vehicleRegistration' })
    vehicle: Vehicle;

    @ManyToOne(type => Municipality, municipality => municipality.tickets)
    @JoinColumn({ name: 'municipalityId', referencedColumnName: 'municipalityId' })
    municipality: Municipality;

    @OneToMany(type => TicketHistory, ticketHistory => ticketHistory.ticket)
    ticketHistory: TicketHistory[];

    @OneToMany(type => Appeal, appeal => appeal.ticket, { nullable: true })
    appeals: Appeal[];
}
