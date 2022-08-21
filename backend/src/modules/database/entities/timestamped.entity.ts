import { DateTransformer } from '@database/transformers/date.transformer';
import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Moment } from 'moment';

export abstract class TimeStamped extends BaseEntity {
    @CreateDateColumn({ type: 'timestamptz', transformer: new DateTransformer(true) })
    createdAt: Moment;
    @UpdateDateColumn({ type: 'timestamptz', transformer: new DateTransformer(true) })
    updatedAt: Moment;
}
