export interface ITicketData {
    ticketType: string;
    citationNo: string;
    courthouse: string;
    violationCodes: string;
    violationDate: string;
    vehicleYear: string;
    vehicleMake: string;
    modelType: string;
    amount: string;
    currency: string;
    city: string;
    address: string;
    id: number;
    institutionName: string;
    ticketStatus: number;
    transactionState: number;
    ticketSystemName: 'RoadProtectIL';
    israelIdNumber: string;
    customerId: number;
    hasMembership: boolean;
    paymentRefNumber: string;
}

export interface TicketModel {
    ticketData: ITicketData;
    questionsAndAnswers: string | string[][];
}
