import { Controller } from '@nestjs/common';
import { ApiUseTags, ApiModelProperty } from '@nestjs/swagger';
import { LogChannel } from '../config/logs';
import { LoggerService } from '@logger';
import chalk from 'chalk';
import { inspect } from 'util';
import config from '@config';
import { omitUnreadable } from './omit-unreadable';
import * as purdy from 'purdy';

const logger = new LoggerService();

export function MyController(prefix: string, swaggerName: string = '') {
    swaggerName = swaggerName || prefix;

    return target => {
        Controller(prefix)(target);
        ApiUseTags(swaggerName)(target);
    };
}

export function ApiModel() {
    return target => {
        const props = target.getAttributeTypeMap();
        for (const prop of props) {
            ApiModelProperty()(target.prototype, prop.name);
        }
    };
}

export function logZARequests(target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args: any[]) {
        const startTime = Date.now();
        const result = await method.apply(this, args);
        const diff = Date.now() - startTime;

        // set logging colour depending on time taken to make the request
        let colour = chalk.redBright;
        if (diff <= 100) {
            colour = chalk.greenBright;
        } else if (diff <= 500 && diff > 100) {
            colour = chalk.yellowBright;
        }

        logger.debug(LogChannel.ZA_REQUEST, colour(`Time for request to ZA system: ${diff}ms`), propertyName, {
            args,
            response: result.body,
        });

        return result;
    };
    return propertyDescriptor;
}
