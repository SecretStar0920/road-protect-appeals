import { DocumentModel } from './document.model';

export interface TicketModel {
    ticketType: string;
    citationNo: string;
    courthouse: string;
    licensePlate: string;
    violationCodes: string;
    violationDate: string;
    vehicleYear: string;
    vehicleMake: string;
    modelType: string;
    amount: string;
    currency: string;
    city: string;
    address: string;
    violationCity: string;
    violationAddress: string;
    id: number;
    institutionName: string;
    ticketStatus: number;
    ticketStatusName: string;
    transactionState: number;
    ticketSystemName: 'RoadProtectIL';
    israelIdNumber: string;
    customerId: number;
    hasMembership: boolean;
    documents: DocumentModel[];
    questionsAndAnswers: string[][];
}
