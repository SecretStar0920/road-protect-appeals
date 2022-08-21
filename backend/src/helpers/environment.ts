import { EnvironmentException } from '../exceptions/environment.exception';

export enum EnvironmentOptions {
    beta = 'beta',
    develop = 'develop',
    integration = 'integration',
    production = 'production',
    qa = 'qa',
    testing = 'testing',
}

export function determineEnvironment(environment: string): EnvironmentOptions {
    switch (environment) {
        case 'development':
        case 'develop':
        case 'dev':
            return EnvironmentOptions.develop;
        case 'test':
        case 'testing':
            return EnvironmentOptions.testing;
        case 'int':
        case 'integration':
            return EnvironmentOptions.integration;
        case 'production':
        case 'prod':
            return EnvironmentOptions.production;
        case 'qa':
        case 'quality':
        case 'staging':
            return EnvironmentOptions.qa;
        case 'beta':
            return EnvironmentOptions.beta;
        default:
            throw new EnvironmentException(environment);
    }
}
