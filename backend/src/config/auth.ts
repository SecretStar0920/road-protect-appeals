export const auth = {
    bcrypt: {
        rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'temp-secret',
        expiry: process.env.JWT_EXPIRY || '12 hours',
    },
};
