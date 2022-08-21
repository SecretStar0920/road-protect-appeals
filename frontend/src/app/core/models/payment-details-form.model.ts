export class PaymentDetailsFormModel {
    fullName: string;
    mobileNumber: string; // format should be: '05*-*******'; regex: ^0[5,7][0-9]-[1-9][0-9]{6}$
    cardHolderId: number; // minLength: 5, maxLength: 9, TZVALIDATION;
    email: string; // must be valid email.
    city: string;
    street: string;
    houseNumber: string;
    cardNumber: number;
    valid: { month: number; year: number }; // NOTE - consider to break into seperate properties;
    CVV: string; // 3 digits; regex: ^[0-9]{3}$
    amountDue: number;
    currency: string;
}
