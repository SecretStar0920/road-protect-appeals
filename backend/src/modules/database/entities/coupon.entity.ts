import { CouponLog } from '@database/entities/coupon-log.entity';
import { TimeStamped } from '@database/entities/timestamped.entity';
import { DateTransformer } from '@database/transformers/date.transformer';
import { Moment } from 'moment';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, SelectQueryBuilder } from 'typeorm';
import { CouponPayment } from '@database/entities/coupon-payment.entity';

export const COUPON_CONSTRAINTS = {
    code: {
        keys: ['code'],
        constraint: 'unique_coupon_code',
        description: 'A coupon already exists with this code',
    },
};

@Entity()
@Index(COUPON_CONSTRAINTS.code.constraint, COUPON_CONSTRAINTS.code.keys, { unique: true, where: '"deletedAt" IS NULL' })
export class Coupon extends TimeStamped {
    @PrimaryGeneratedColumn()
    @Index({ unique: true })
    couponId: number;

    @Column('text')
    code: string;

    @Column('int')
    maximumUses: number;

    @Column('timestamptz', { transformer: new DateTransformer() })
    startDate: Moment;

    @Column('timestamptz', { transformer: new DateTransformer() })
    expiryDate: Moment;

    @Column('timestamptz', {
        transformer: new DateTransformer(),
        nullable: true,
        default: null,
    })
    deletedAt: Moment;

    @Column('boolean', { default: true })
    active: boolean;

    @Column('jsonb', {
        default: {},
    })
    details: any;

    @OneToMany(type => CouponLog, couponLog => couponLog.coupon)
    couponLogs: CouponLog[];

    @OneToMany(type => CouponPayment, couponPayment => couponPayment.coupon)
    couponPayments: CouponPayment[];

    static getByCouponCode(code: string): SelectQueryBuilder<Coupon> {
        return this.createQueryBuilder('coupon').andWhere('coupon.code = :code', { code });
    }
}
