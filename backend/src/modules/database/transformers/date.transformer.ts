import moment = require('moment');
import { Moment } from 'moment';
import { ValueTransformer } from 'typeorm';

/**
 * Date Transformer for DB
 * Convert moment to string on write
 * Convert timestamp to moment on fetch
 */
export class DateTransformer implements ValueTransformer {
    private generateTime: boolean;

    constructor(generateTime?: boolean) {
        this.generateTime = !!generateTime;
    }

    to(value?: Moment): string | null {
        // Don't use moment timezone here (always write to db in UTC)
        if (value) {
            return value.toISOString();
        }
        return this.generateTime ? moment().toISOString() : null;
    }

    from(value?: string): Moment | null {
        return value ? moment(value) : null;
    }
}
