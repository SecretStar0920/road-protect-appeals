export const postmark = {
    token: process.env.POSTMARK_TOKEN,
    from: process.env.FROM_EMAIL || 'info@roadprotect.co.il',
    testEmail: process.env.TEST_EMAIL || '',
    appealBcc: process.env.APPEAL_EMAIL || 'appeal@roadprotect.co.il',
    mainEmail: process.env.APPEAL_EMAIL || 'appeal@roadprotect.co.il',
};
