import { Entity, PrimaryGeneratedColumn, Index, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { Ticket, Violation } from '@database/entities/ticket.entity';
import { TicketStatusModel } from '../../../models/ticket-status.model';
import { UpdateTicketRequest } from '../../../apis/ZA/model/update-ticket-request';
import { User } from '@database/entities/user.entity';
import { Appeal } from '@database/entities/appeal.entity';
import { Vehicle } from '@database/entities/vehicle.entity';
import { Municipality } from '@database/entities/municipality.entity';

export enum TicketActions {
    CREATED = 'Created',
    EDITED = 'Edited',
    APPEALED = 'Appealed',
    DELETED = 'Deleted',
}

@Entity()
export class TicketHistory extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    ticketHistoryId: number;

    @Column('enum', { enum: TicketActions, nullable: false })
    action: TicketActions;

    @Column('jsonb', { nullable: false })
    updatedTicket: TicketInterface;

    @Column('jsonb', { nullable: true })
    previousTicket?: TicketInterface;

    @ManyToOne(type => Ticket, ticket => ticket.ticketHistory)
    @JoinColumn({ name: 'ticketId', referencedColumnName: 'ticketId' })
    ticket: Ticket;
}

export interface TicketInterface {
    ticketId: number;
    citationNo?: string;
    violation?: Violation;
    status?: TicketStatusModel;
    details?: Partial<UpdateTicketRequest>;
    user: User;
    vehicle: Vehicle;
    municipality: Municipality;
    appeals: Appeal[];
}
