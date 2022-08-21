import path from 'path';
import appRootPath from 'app-root-path';
import { environment } from './environment';

export enum LogChannel {
    DEFAULT = 'default',
    EMAILS = 'emails',
    FAX = 'fax',
    ZA = 'za',
    USER = 'user',
    USER_LOG = 'user-log',
    USER_ACTIONS = 'user-actions',
    POSTMARK = 'postmark',
    CONTACT_US = 'contact-us',
    CUSTOMER = 'customer',
    AUTH = 'auth',
    CAR = 'car',
    CITY = 'city',
    PAYMENT = 'payment',
    TICKET = 'ticket',
    TICKET_HISTORY = 'ticket-history',
    APPEAL = 'appeal',
    VEHICLE = 'vehicle',
    MUNICIPALITY = 'municipality',
    REDIS = 'redis',
    RESOURCES = 'resource-loader',
    REQUEST = 'request',
    ZA_REQUEST = 'za-request',
    CLI = 'cli',
    COUPON = 'coupon',
    SOCKET = 'socket',
}

export enum LogType {
    INFO = 'INFO',
    CRITICAL = 'CRITICAL',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

export const logs = {
    filenames: {
        all: 'log.log',
        error: 'error.log',
    },
    interceptor: {
        by: true,
        executionTime: true,
    },
    logPath: (channel: string): string => {
        const storage = process.env.STORAGE_DIRECTORY || path.join(appRootPath.path, 'storage');
        return path.join(storage, `logs/${channel}.log`);
    },
};
