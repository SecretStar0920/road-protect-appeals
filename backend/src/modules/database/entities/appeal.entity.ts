import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { TimeStamped } from './timestamped.entity';
import { DocumentModel } from '../../../models/document.model';
import { Ticket } from '@database/entities/ticket.entity';
import { Payment } from '@database/entities/payment.entity';
import { Moment } from 'moment';
import { DateTransformer } from '@database/transformers/date.transformer';

export interface AppealDetails {
    documents?: DocumentModel[];
    questionsAndAnswers?: string[][];
    roadProtectZAId: string;
}

@Entity()
export class Appeal extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    appealId: number;

    @Column('jsonb', { default: {}, nullable: false })
    details: AppealDetails;

    @Column('text', { nullable: true })
    customParagraphs: string;

    @Column('timestamptz', {
        transformer: new DateTransformer(),
        nullable: true,
        default: null,
    })
    deletedAt: Moment;

    @ManyToOne(type => Ticket, ticket => ticket.appeals)
    @JoinColumn({ name: 'ticketId', referencedColumnName: 'ticketId' })
    ticket: Ticket;

    @OneToMany(type => Payment, payment => payment.appeal, { nullable: true })
    payments: Payment[];
}
