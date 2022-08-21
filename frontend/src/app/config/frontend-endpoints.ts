import { environment } from '../../environments/environment';

export interface IFrontendEndpoints {
    defaultLanding: string;
    terms: string;
    contactUs: string;
    aboutUs: string;
    cost: string;
    welcome: string;
    login: string;
    otpConfirm: string;
    appealsHome: string;
    appealFineDetails: string;
    appealDetails: string;
    appealPics: string;
    appealUserInfo: string;
    appealIdUpload: string;
    appealSummary: string;
    appealPayment: string;
    appealLastStep: string;
    appealFinished: string;
}

export const ANGULAR_ENDPOINTS: IFrontendEndpoints = {
    defaultLanding: 'welcome',
    aboutUs: 'about-us',
    contactUs: 'contact-us',
    cost: 'pricing',
    terms: 'terms-and-conditions',
    welcome: 'welcome',
    login: 'start',
    otpConfirm: 'confirm',
    appealsHome: 'appeal',
    appealFineDetails: 'fine',
    appealDetails: 'details',
    appealPics: 'pics',
    appealUserInfo: 'user-info',
    appealIdUpload: 'id-upload',
    appealSummary: 'summary',
    appealPayment: 'payment',
    appealLastStep: 'last-step',
    appealFinished: 'finished',
};

export const FRONTEND_ENDPOINTS: IFrontendEndpoints = {
    defaultLanding: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.defaultLanding}`,
    aboutUs: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.aboutUs}`,
    contactUs: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.contactUs}`,
    cost: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.cost}`,
    terms: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.terms}`,
    welcome: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.welcome}`,

    // Login
    login: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.login}`,
    otpConfirm: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.login}/${ANGULAR_ENDPOINTS.otpConfirm}`,

    // Appeal
    appealsHome: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}`,
    appealFineDetails: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealFineDetails}`,
    appealDetails: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealDetails}`,
    appealPics: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealPics}`,
    appealUserInfo: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealUserInfo}`,
    appealIdUpload: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealIdUpload}`,
    appealSummary: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealSummary}`,
    appealPayment: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealSummary}/${ANGULAR_ENDPOINTS.appealPayment}`,
    appealLastStep: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealSummary}/${ANGULAR_ENDPOINTS.appealLastStep}`,
    appealFinished: `${environment.frontendUrl}/${ANGULAR_ENDPOINTS.appealsHome}/${ANGULAR_ENDPOINTS.appealFinished}`,
};
