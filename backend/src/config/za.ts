import { rpZaErrorCodes } from './rp-za-error-codes';

export const za = {
    device: 'Website',
    ticketSystem: 'RoadProtectIL',
    host: process.env.ZA_URL || 'https://roadprotectildevelopment.appspot.com',
    errorCodes: rpZaErrorCodes,
    countryCode: process.env.ZA_COUNTRY_CODE || '3',
};
