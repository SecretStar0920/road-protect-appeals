import { unitOfTime } from 'moment';

export const coupon = {
    defaultCount: 1,
    defaultLength: 8,
    defaultExpiry: {
        period: 2,
        units: (): unitOfTime.DurationConstructor => 'months',
    },
    defaultUses: 100,
};
