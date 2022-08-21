import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { CourthouseModel } from '../../../models/courthouse.model';
import { Ticket } from '@database/entities/ticket.entity';

@Entity()
export class Municipality extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    municipalityId: number;

    @Index({ unique: true })
    @Column('text')
    cityCode: string;

    @Column('text')
    cityName: string;

    @Column('jsonb', { default: {} })
    courthouseRP: CourthouseModel;

    @OneToMany(type => Ticket, ticket => ticket.municipality, { nullable: false })
    tickets: Ticket[];
}
