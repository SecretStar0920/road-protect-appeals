import { initialiseConfig } from './initialise-config';
initialiseConfig();

import { LoggerService } from '@logger';
import { app } from './config/app';
import { auth } from './config/auth';
import { coupon } from './config/coupon';
import { creditGuard } from './config/credit-guard';
import { databases } from './config/databases';
import { environment } from './config/environment';
import { fax } from './config/fax';
import { LogChannel, logs } from './config/logs';
import { paths } from './config/paths';
import { postmark } from './config/postmark';
import { redis } from './config/redis';
import { swagger } from './config/swagger';
import { twilio } from './config/twilio';
import { za } from './config/za';
import { determineEnvironment, EnvironmentOptions } from './helpers/environment';
import { appealCost } from './config/appeal-cost';

const defaultValues = {
    app,
    appealCost,
    redis,
    swagger,
    fax,
    postmark,
    za,
    twilio,
    creditGuard,
    paths,
    databases,
    environment,
    logs,
    coupon,
    auth,
};

const ConfigByEnv = {
    [EnvironmentOptions.develop]: {
        ...defaultValues,
    },
    [EnvironmentOptions.beta]: {
        ...defaultValues,
    },
    [EnvironmentOptions.integration]: {
        ...defaultValues,
    },
    [EnvironmentOptions.qa]: {
        ...defaultValues,
    },
    [EnvironmentOptions.production]: {
        ...defaultValues,
    },
};

export const getENV = () => {
    try {
        return determineEnvironment((process.env.NODE_ENV || process.env.ENV || '').trim());
    } catch (e) {
        LoggerService.instance.error(LogChannel.DEFAULT, e.message, getENV.name, e.stack);
    }
    return EnvironmentOptions.develop;
};

export default ConfigByEnv[getENV()] as typeof defaultValues;
