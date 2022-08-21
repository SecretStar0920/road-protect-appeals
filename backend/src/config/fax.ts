export const fax = {
    email: process.env.FAX_EMAIL || 'info@roadprotect.co.il',
    password: process.env.FAX_PASSWORD || '',
    api: {
        send: 'https://www.myfax.co.il/action/faxUpload.do',
        checkStatus: 'https://www.myfax.co.il/action/faxStatus.do',
    },
};
