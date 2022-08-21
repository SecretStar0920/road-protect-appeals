import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    TableInheritance,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TimeStamped } from '@database/entities/timestamped.entity';
import { DateTransformer } from '@database/transformers/date.transformer';
import { Moment } from 'moment';
import { Appeal } from '@database/entities/appeal.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Payment extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    paymentId: number;

    @Column('int', { nullable: true })
    amount: number;

    @UpdateDateColumn({ type: 'timestamptz', transformer: new DateTransformer(true) })
    paymentDate: Moment;

    @Column('jsonb', { default: {}, nullable: true })
    details: any;

    @ManyToOne(type => Appeal, appeal => appeal.payments)
    @JoinColumn({ name: 'appealId', referencedColumnName: 'appealId' })
    appeal: Appeal;

    @Column('text')
    abstract status: string;
}
