import { couponLogDescription, CouponLogType } from '@database/entities/coupon-log.entity';

interface LogDetails {
    type: CouponLogType;
    description: string;
}

export const COUPON_LOG_MAP = {
    error: {
        type: CouponLogType.Error,
        description: couponLogDescription.error,
    },
    success: {
        type: CouponLogType.Success,
        description: couponLogDescription.success,
    },
    generated: {
        type: CouponLogType.Admin,
        description: couponLogDescription.generated,
    },
    activated: {
        type: CouponLogType.Admin,
        description: couponLogDescription.activated,
    },
    deactivated: {
        type: CouponLogType.Admin,
        description: couponLogDescription.deactivated,
    },
    deleted: {
        type: CouponLogType.Admin,
        description: couponLogDescription.deleted,
    },
};
