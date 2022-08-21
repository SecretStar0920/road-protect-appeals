import config from '@config';
import { LoggingWinston } from '@google-cloud/logging-winston';
import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import d from 'debug';
import purdy from 'purdy';
import { inspect } from 'util';
import * as winston from 'winston';
import { format } from 'winston';
import * as Transport from 'winston-transport';
import { LogChannel, LogType } from '../config/logs';
import moment = require('moment');

const debug = d('rp-appeals:logger');
const { combine, label } = format;

@Injectable()
export class LoggerService {
    private loggers: { [logger: string]: any } = {};

    private static _instance: LoggerService;
    static get instance(): LoggerService {
        return this._instance || (this._instance = new LoggerService());
    }

    constructor() {}

    info(channel: LogChannel, message: string, fnc: string, context?: any) {
        this.writeLog(channel, LogType.INFO, message, fnc, context);
    }

    error(channel: LogChannel, message: string, fnc: string, context?: any) {
        this.writeLog(channel, LogType.ERROR, message, fnc, context);
    }

    critical(channel: LogChannel, message: string, fnc: string, context?: any) {
        this.writeLog(channel, LogType.CRITICAL, message, fnc, context);
    }

    warn(channel: LogChannel, message: string, fnc: string, context?: any) {
        this.writeLog(channel, LogType.WARNING, message, fnc, context);
    }

    debug(channel: LogChannel, message: string, fnc: string, context?: any) {
        this.writeLog(channel, LogType.DEBUG, message, fnc, context);
    }

    private writeLog(channel: LogChannel, type: LogType, message: string, fnc: string, context: any) {
        // limit log size of context logged
        let details: any;

        // if (config.environment.isProd() || config.environment.isStaging()) {
        details = context ? ' ' + inspect(context, { breakLength: Infinity, compact: true, depth: 5 }) : '';
        // } else {
        //     context = omitUnreadable(context);
        //     details = context ? '\n' + purdy.stringify(context, { indent: 2, depth: 5 }) : '';
        // }

        const messageObject = {
            timestamp: moment().toISOString(),
            level: type,
            message,
            channel,
            functionName: fnc,
            details,
        };

        if (!context) {
            delete messageObject.details;
        }

        if (!fnc) {
            delete messageObject.functionName;
        }

        if (messageObject.details instanceof Error) {
            messageObject.details = messageObject.details.toString();
        }

        switch (type) {
            case LogType.CRITICAL:
                return this.getLogger(channel).critical(messageObject);
            case LogType.ERROR:
                return this.getLogger(channel).error(messageObject);
            case LogType.WARNING:
                return this.getLogger(channel).warning(messageObject);
            case LogType.INFO:
                return this.getLogger(channel).info(messageObject);
            case LogType.DEBUG:
                return this.getLogger(channel).debug(messageObject);
            default:
                return this.getLogger(LogChannel.DEFAULT).info(messageObject);
        }
    }

    private getLogger(channel: LogChannel) {
        this.loggers[channel] = this.loggers[channel] || this.createLogger(channel);
        return this.loggers[channel];
    }

    private createLogger(channel: string) {
        debug(`Creating Winston logger for channel ${channel}`);
        const transportsToCreate: Transport[] = [
            new winston.transports.File({
                filename: config.logs.logPath(channel.toString()),
                handleExceptions: true,
            }),
        ];

        if (config.environment.isProd() || config.environment.isBeta() || config.environment.isStaging()) {
            transportsToCreate.push(
                new LoggingWinston({
                    logName: `appeals-${config.environment.env}-backend`,
                }),
            );
        } else {
            transportsToCreate.push(
                new winston.transports.Console({
                    format: this.consoleFormat(),
                }),
            );
        }

        let level = 'debug';
        if (config.environment.isTesting()) {
            level = 'error';
        }

        return winston.createLogger({
            level,
            levels: {
                critical: 0,
                error: 1,
                warning: 2,
                info: 3,
                debug: 4,
                silly: 5,
            },
            format: combine(label({ label: channel }), winston.format.json()),
            transports: transportsToCreate,
            exitOnError: false,
        });
    }

    private consoleFormat() {
        return winston.format.printf(info => {
            const timestamp = chalk.gray(moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss'));
            let level = '';
            if (info.level === 'critical') {
                level = chalk.bgRed(info.level);
            } else if (info.level === 'error') {
                level = chalk.red(info.level);
            } else if (info.level === 'warning') {
                level = chalk.yellow(info.level);
            } else if (info.level === 'info') {
                level = chalk.blue(info.level);
            } else if (info.level === 'debug') {
                level = chalk.cyan(info.level);
            } else {
                level = chalk.grey(info.level);
            }
            const message = info.message;
            let details;
            if (typeof info.details === 'string') {
                details = info.details ? info.details : '';
            } else if (typeof info.details === 'object') {
                try {
                    if (config.environment.isDev()) {
                        details = info.details ? '\n' + purdy.stringify(info.details, { indent: 2, depth: 10 }) : '';
                    } else {
                        details = info.details
                            ? ' ' +
                            inspect(info.details, {
                                breakLength: Infinity,
                                compact: true,
                            })
                            : '';
                    }
                } catch (e) {
                    details = '[unable to stringify this context as it was circular or invalid]';
                }
            } else {
                details = info.details != null ? info.details : '';
            }
            const functionName = info.functionName ? chalk.magenta(chalk.italic(`${info.functionName}`)) : '';
            const channel = chalk.bold(info.channel);
            return `${timestamp} ${level} ${channel} ${functionName} ${message} ${details}`;
        });
    }
}
