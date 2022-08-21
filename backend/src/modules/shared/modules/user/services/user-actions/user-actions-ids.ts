import { LogType } from '../../../../../../config/logs';

export const UserActionsIds = {
    LOGIN: {
        SUCCESS: { logType: LogType.INFO, description: 'User logged in successfully' },
        FAIL: { logType: LogType.WARNING, description: 'User could not log in' },
    },
    TICKET: {
        CREATE: {
            SUCCESS: { logType: LogType.INFO, description: 'User created a new ticket' },
            FAIL: { logType: LogType.ERROR, description: 'User could not create a new ticket' },
        },
        EDIT: {
            SUCCESS: { logType: LogType.INFO, description: 'User edited a ticket' },
            FAIL: { logType: LogType.ERROR, description: 'User could not edit a ticket' },
        },
        DELETE: {
            SUCCESS: { logType: LogType.INFO, description: 'User deleted a ticket' },
            FAIL: { logType: LogType.ERROR, description: 'User could not delete a ticket' },
        },
    },
    APPEAL: {
        CREATE: {
            SUCCESS: { logType: LogType.INFO, description: 'User created a new appeal' },
            FAIL: { logType: LogType.ERROR, description: 'User could not create a new appeal' },
        },
        EDIT: {
            SUCCESS: { logType: LogType.INFO, description: 'User edited an appeal' },
            FAIL: { logType: LogType.ERROR, description: 'User could not edit an appeal' },
        },
        DELETE: {
            SUCCESS: { logType: LogType.INFO, description: 'User deleted an appeal' },
            FAIL: { logType: LogType.ERROR, description: 'User could not delete an appeal' },
        },
        SENT: {
            SUCCESS: { logType: LogType.INFO, description: 'User sent appeal to the municipality' },
            FAIL: { logType: LogType.ERROR, description: 'User could not send appeal to the municipality' },
        },
    },
    PAY: {
        CREDIT_CARD: {
            SUCCESS: { logType: LogType.INFO, description: 'User paid for an appeal with a credit card' },
            FAIL: { logType: LogType.ERROR, description: 'User could not pay for an appeal with a credit card' },
        },
        COUPON: {
            SUCCESS: { logType: LogType.INFO, description: 'User paid for an appeal with a coupon' },
            FAIL: { logType: LogType.ERROR, description: 'User could not pay for an appeal with a coupon' },
        },
    },
};
