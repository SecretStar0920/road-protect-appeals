export const creditGuard = {
    username: process.env.CREDIT_GUARD_USERNAME || 'cgdemo',
    password: process.env.CREDIT_GUARD_PASSWORD || 'C!kd2nc3a',
    terminalId: process.env.CREDIT_GUARD_TERMINAL_ID || '0882810010',
    mid: process.env.CREDIT_GUARD_MID || 11665,
    gatewayUrl: process.env.CREDIT_GUARD_URL || 'https://cguat2.creditguard.co.il/xpo/Relay',
    additionalId: process.env.CREDIT_GUARD_ADDITIONAL_ID || '',
    xmc: {
        username: process.env.CREDIT_GUARD_XMC_USERNAME || 'demo',
        password: process.env.CREDIT_GUARD_XMC_PASSWORD || 'B#cde1234',
        idCode: process.env.CREDIT_GUARD_XMC_ID_CODE || 111111,
    },
};
