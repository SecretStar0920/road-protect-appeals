import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ticketStatusListMock from '../../../assets/jsons/mocks/ticket-status-list.mock.json';
import { environment } from '../../../environments/environment';
import isDevelopment from '../helpers/is-development';
import { Courthouse } from '../models/courthouse.model';
import { CustomerModel } from '../models/customer.model';
import { DocumentModel } from '../models/document.model';
import { GetQuestionsAndAnswersResponseModel } from '../models/get-questions-and-answers-response.model';
import { TicketStatusModel } from '../models/ticket-status.model';
import { TicketModel } from '../models/ticket.model';
import { CurrentUserService } from './current-user.service';
import { TicketService } from './ticket.service';
import { TrackingService } from './tracking/tracking.service';

@Injectable({
    providedIn: 'root',
})
export class CrudService {
    error: any;

    constructor(
        private http: HttpClient,
        private ticketService: TicketService,
        private currentUserService: CurrentUserService,
        private trackingService: TrackingService,
    ) {}

    public async getCustomer(userId: string): Promise<CustomerModel> {
        const localUrl = `${environment.baseUrl}/customer/${userId}`;
        return this.http.get<CustomerModel>(localUrl).toPromise();
    }

    public async addTicket(customerId: number): Promise<TicketModel> {
        let request = this.ticketService.fine.getRawValue();
        const partner = this.trackingService.getPartner();
        request = {
            ...request,
            customerId: customerId.toString(),
            partner,
        };
        return this.http.post<TicketModel>(`${environment.baseUrl}/za/ticket`, request).toPromise();
    }

    public async updateTicket(): Promise<any> {
        const customerId = this.ticketService.userInfo.get('id').value;
        let request = this.ticketService.fine.getRawValue();
        request = {
            ...request,
            customerId: customerId.toString(),
            questionsAndAnswers: this.ticketService.appealPaths,
            violationDate: request.violationDate.utcOffset(0, true),
        };
        return this.http.put(`${environment.baseUrl}/za/ticket`, request).toPromise();
    }

    public getDocumentsByTicketId(id: string): Promise<DocumentModel[]> {
        return this.http.get<DocumentModel[]>(`${environment.baseUrl}/za/ticket/${id}/documents`).toPromise();
    }

    public async getCities(): Promise<string[]> {
        return this.http.get<string[]>(`${environment.baseUrl}/cities`).toPromise();
    }

    public async getStreets(cityName: string): Promise<string[]> {
        if (!cityName || cityName === 'null') {
            return [];
        }
        return this.http.get<string[]>(`${environment.baseUrl}/cities/${cityName}`).toPromise();
    }

    public async getVehicleManufactures() {
        const localUrl = `${environment.baseUrl}/cars`;
        return this.http.get<string[]>(localUrl).toPromise();
    }

    public async getVehicleModel(manufacture: string) {
        if (!manufacture || manufacture === 'null') {
            return [];
        }
        const localUrl = `${environment.baseUrl}/cars/${manufacture}`;
        return this.http.get<string[]>(localUrl).toPromise();
    }

    public async getTicketHistory(): Promise<TicketModel[]> {
        const customerId = this.ticketService.userInfo.get('id').value;
        return this.http
            .get<TicketModel[]>(`${environment.baseUrl}/za/ticket/history?customerId=${customerId}`)
            .toPromise();
    }

    public async ticketStatusList() {
        let ticketStatusList: TicketStatusModel[] = [];
        if (isDevelopment()) {
            ticketStatusList = ticketStatusListMock;
        } else {
            ticketStatusList = await this.http
                .get<TicketStatusModel[]>(`${environment.baseUrl}/za/ticket/status-list`)
                .toPromise();
        }
        return ticketStatusList.reduce((accumulator, currentValue) => {
            accumulator[currentValue.id] = currentValue.name;
            return accumulator;
        }, {});
    }

    public async getCourtHouses() {
        return this.http.get<Courthouse[]>(`${environment.baseUrl}/za/courtHouses`).toPromise();
    }

    public async getQuestionsAndAnswers(ticketId: number): Promise<GetQuestionsAndAnswersResponseModel> {
        return this.http
            .get<GetQuestionsAndAnswersResponseModel>(`${environment.baseUrl}/za/ticket/qna?ticketId=${ticketId}`)
            .toPromise();
    }

    public async uploadTicketDocument(
        base64: string,
        mimeType: string,
        description: string,
        typeCode: number,
    ): Promise<DocumentModel> {
        const ticketId = this.ticketService.fine.get('id').value;
        const request = {
            ticketDocumentBase64: base64,
            ticketDocumentMimeType: mimeType,
            documentDescription: description,
            documentTypeCode: typeCode,
        };
        return this.http
            .post<DocumentModel>(`${environment.baseUrl}/za/ticket/${ticketId}/upload-document`, request)
            .toPromise();
    }

    public async updateCustomerProfile() {
        const {
            id,
            firstName,
            lastName,
            phonePrefix,
            phone,
            additionalPhonePrefix,
            additionalPhone,
            israelIdNumber,
            city,
            address,
            houseNumber,
            email,
        } = this.ticketService.userInfo.getRawValue();
        const request = {
            firstName,
            lastName,
            mobileNumber: phonePrefix + phone,
            additionalMobileNumber:
                additionalPhonePrefix && additionalPhone ? additionalPhonePrefix + additionalPhone : '',
            israelIdNumber,
            city,
            email,
            address: houseNumber ? `${address}_${houseNumber}` : address,
        };
        const { authorization } = await this.http
            .put<any>(`${environment.baseUrl}/za/customer/${id}`, request)
            .toPromise();
        localStorage.setItem('token', authorization.access_token);
    }

    public async deleteTicket(ticketId: number): Promise<void> {
        return this.http.delete<void>(`${environment.baseUrl}/za/ticket/${ticketId}`).toPromise();
    }

    public async deleteDocumentById(documentId: number): Promise<void> {
        const ticketId = this.ticketService.fine.get('id').value;
        return this.http
            .delete<void>(`${environment.baseUrl}/za/ticket/${ticketId}/document/${documentId}`)
            .toPromise();
    }

    public async doDeal(): Promise<{ url: string }> {
        const email = this.ticketService.userInfo.get('email').value;
        const paymentRequest = {
            email,
        };
        return this.http.post<{ url: string }>(`${environment.baseUrl}/payment/`, paymentRequest).toPromise();
    }

    public async payByCoupon(coupon: string): Promise<boolean> {
        const mobileNumber = this.currentUserService.user.mobileNumber;
        const ticketId: string = this.ticketService.fine.get('id').value;
        return this.http
            .post<boolean>(`${environment.baseUrl}/payment/coupon`, {
                coupon,
                mobileNumber,
                ticketId,
            })
            .toPromise();
    }

    public generateTicketDefense() {
        const ticketId = this.ticketService.fine.get('id').value;
        const request = {
            customParagraphs: this.ticketService.finalParagraph,
        };
        return this.http
            .post<{ url: string }>(`${environment.baseUrl}/za/ticket/${ticketId}/generate-defense`, request)
            .toPromise();
    }

    public updateTicketStatus(status: string, tId?: string, data?: string) {
        const ticketId: string = this.ticketService.fine.get('id').value;
        const customerId: string = this.ticketService.userInfo.get('id').value;
        return this.http
            .post<TicketModel>(`${environment.baseUrl}/za/ticket/${tId || ticketId}/update-status`, {
                customerId,
                status,
                data,
            })
            .toPromise();
    }

    public async submitAppeal(customParagraphs: string) {
        const ticketId: string = this.ticketService.fine.get('id').value;
        const user = this.ticketService.userInfo.getRawValue();
        const ticket = this.ticketService.fine.getRawValue();
        return this.http
            .post<{ success: boolean }>(`${environment.baseUrl}/za/ticket/${ticketId}/submit-appeal`, {
                user,
                ticket,
                customParagraphs,
            })
            .toPromise();
    }

    public async getLatestPdfDocument(ticketId: string) {
        return this.http
            .get<{ url: string }>(`${environment.baseUrl}/za/ticket/${ticketId}/documents/pdf/latest`)
            .toPromise();
    }
}
