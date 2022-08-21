import { Coupon } from '@database/entities/coupon.entity';
import { TimeStamped } from '@database/entities/timestamped.entity';
import { User } from '@database/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum CouponLogType {
    Success = 'SUCCESS',
    Error = 'ERROR',
    Admin = 'ADMIN',
}

export const couponLogDescription = {
    success: 'Successfully used coupon.',
    error: 'Failed to use coupon. See details.',
    generated: 'Generated coupon',
    activated: 'Activated coupon',
    deactivated: 'Deactivated coupon',
    deleted: 'Deleted coupon',
};

export interface CouponLogDetails {
    roadProtectZATicketId?: number;
    message?: string;
}

@Entity()
export class CouponLog extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    couponLogId: number;

    @Column('enum', { enum: CouponLogType })
    type: CouponLogType;

    @Column('text')
    description: string;

    @Column('jsonb', {
        default: {},
    })
    details: CouponLogDetails;

    @ManyToOne(type => Coupon, coupon => coupon.couponLogs, { nullable: false })
    @JoinColumn({ name: 'couponId', referencedColumnName: 'couponId' })
    @Index()
    coupon: Coupon;

    @ManyToOne(type => User, user => user.couponLogs, { nullable: false })
    @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
    user: User;
}
