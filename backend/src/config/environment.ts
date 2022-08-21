function getEnv() {
    return (process.env.ENV || 'prod').toLowerCase();
}

function isEnv(env: string): boolean {
    return getEnv().toLowerCase() === env.toLowerCase();
}

export const environment = {
    // Default it to production so that we don't reset databases by
    // mistake
    env: process.env.ENV || 'prod',
    isBeta: (): boolean => {
        return isEnv('beta');
    },
    isProd: (): boolean => {
        return isEnv('prod') || isEnv('production');
    },
    isDev: (): boolean => {
        return isEnv('dev') || isEnv('development') || isEnv('develop') || isEnv('staging');
    },
    isTesting: (): boolean => {
        return isEnv('test') || isEnv('testing');
    },
    isStaging: (): boolean => {
        return isEnv('staging') || isEnv('staging');
    },
};
