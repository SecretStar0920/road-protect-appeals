export const app = {
    apiPrefix: 'api',
    mainUrl: process.env.APP_URL ? `https://${process.env.APP_URL}` : 'http://localhost:3000',
    port: parseInt(process.env.PORT || '3001', 10),
    timezone: process.env.TIMEZONE || 'Africa/Johannesburg',
    momentFormat: 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
};
