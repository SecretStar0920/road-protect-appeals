import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { createWriteStream, promises as fs, readFileSync, unlinkSync } from 'fs';
import * as Handlebars from 'handlebars';
import https from 'https';
import * as _ from 'lodash';
import moment from 'moment';
import * as path from 'path';
import { join } from 'path';
import {
    AddTicketRequest,
    AddUserRequest,
    MiscApi,
    UpdateCustomerProfileRequest,
    UpdateTicketRequest,
    UploadTicketDocumentRequest,
} from '../../apis/ZA/api';
import config, { getENV } from '../../config';
import { LogChannel } from '../../config/logs';
import customerTemplateMetadata from '../../data/customer.email.images.metadata.json';
import { AddLeadTicketRequestDTO } from '../../dto/add-lead-ticket-request.dto';
import { AddTicketRequestDTO } from '../../dto/add-ticket-request.dto';
import { GetAuthorizationTokenRequestDto } from '../../dto/get-authorization-token-request.dto';
import { GetAuthorizationTokenResponseDTO } from '../../dto/get-authorization-token-response.dto';
import { GetCustomerRequestDTO } from '../../dto/get-customer-request.dto';
import { GetCustomerResponseDTO } from '../../dto/get-customer-response.dto';
import { GetQuestionsAndAnswersRequestDTO } from '../../dto/get-questions-and-answers-request.dto';
import { GetTicketHistoryRequestDTO } from '../../dto/get-ticket-history-request.dto';
import { GetTicketResponseDTO } from '../../dto/get-ticket-response.dto';
import { SendFaxRequestDTO } from '../../dto/send-fax-request.dto';
import { SubmitAppealRequestDTO } from '../../dto/submit-appeal-request.dto';
import { UpdateTicketRequestDTO } from '../../dto/update-ticket-request.dto';
import { UploadTicketDocumentRequestDTO } from '../../dto/upload-ticket-document-request.dto';
import { TicketStatus } from '../../enums/ticket-status.enum';
import { EnvironmentOptions } from '../../helpers/environment';
import { CourthouseModel } from '../../models/courthouse.model';
import { CustomerModel } from '../../models/customer.model';
import { DocumentTypeModel } from '../../models/document-type.model';
import { DocumentModel } from '../../models/document.model';
import { TicketStatusModel } from '../../models/ticket-status.model';
import { ITicketData, TicketModel } from '../../models/ticket.model';
import { UpdatePaymentsService } from '../../modules/payment/services/update-payments.service';
import { EditAppealService } from '../../modules/shared/modules/tickets/appeal/services/edit-appeal.service';
import { EditTicketService } from '../../modules/shared/modules/tickets/ticket/services/edit-ticket.service';
import { UpdateTicketsService } from '../../modules/shared/modules/tickets/update-tickets.service';
import { UpdateUserLogsService } from '../../modules/shared/modules/user/services/user-logs/update-user-logs.service';
import { FaxService } from '../fax.service';
import { PostmarkService } from '../postmark.service';
import { Namespace } from 'socket.io';
import { ClientNotificationService } from '../../modules/shared/modules/realtime/client-notification/client-notification.service';

@Injectable()
export class ZaService {
    private readonly _zaApi: MiscApi;

    constructor(
        private readonly faxService: FaxService,
        private readonly updatePaymentsService: UpdatePaymentsService,
        private readonly userLogService: UpdateUserLogsService,
        private readonly postmarkService: PostmarkService,
        private readonly updateTicketsService: UpdateTicketsService,
        private readonly editTicketService: EditTicketService,
        private readonly editAppealService: EditAppealService,
        private logger: LoggerService,
        private clientNotificationService: ClientNotificationService,
    ) {
        this._zaApi = new MiscApi(config.za.host);
    }

    public zaHeaders = (req): { headers: { [name: string]: string } } => ({
        headers: {
            'X-Auth-Token': req.headers['X-Auth-Token'.toLowerCase()],
        },
    });

    private modifyTicketData = (ticketData: ITicketData): ITicketData => {
        const data = { ...ticketData };
        for (const key in data) {
            if (data[key] === 'null') {
                data[key] = '';
            }
        }
        return data;
    };

    public async getAuthorizationToken(
        authorizationRequest: GetAuthorizationTokenRequestDto,
    ): Promise<GetAuthorizationTokenResponseDTO> {
        const fnc = this.getAuthorizationToken.name;
        this.logger.debug(LogChannel.ZA, `Retrieving authorization token`, fnc, authorizationRequest);
        try {
            const { body } = await this._zaApi.getAuthorizationToken(authorizationRequest);
            this.logger.debug(LogChannel.AUTH, 'Found the following auth token', fnc, body);
            return body as GetAuthorizationTokenResponseDTO;
        } catch (exception) {
            this.logger.error(LogChannel.ZA, `Failed to get authorization token`, fnc, {
                authorizationRequest,
                body: exception.body ? exception.body.error : exception,
                stack: exception.stack,
            });
            throw new Error(exception.body ? exception.body : exception);
        }
    }

    public async getCustomer(
        getCustomerRequest: GetCustomerRequestDTO,
        request: Request,
    ): Promise<GetCustomerResponseDTO> {
        const fnc = this.getCustomer.name;
        this.logger.debug(LogChannel.ZA, `Getting customer`, fnc, getCustomerRequest);
        const headers = this.zaHeaders({ ...request });
        const { username } = getCustomerRequest;
        const { ticketSystem } = config.za;
        try {
            const { body } = await this._zaApi.getCustomer(username, ticketSystem, headers);
            this.logger.debug(LogChannel.ZA, 'Found the following customer', fnc, body.data);
            return body.data[0] as GetCustomerResponseDTO;
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to get customer with error message: ${exception.body ? exception.body.error : exception}`,
                fnc,
                { getCustomerRequest, body: exception.body, stack: exception.stack },
            );
            throw new Error(exception.body ? exception.body : exception);
        }
    }

    public async addLeadTicket(addLeadTicketRequest: AddLeadTicketRequestDTO): Promise<number | void> {
        const fnc = this.addLeadTicket.name;
        this.logger.debug(LogChannel.ZA, `Adding a lead ticket`, fnc, addLeadTicketRequest);
        const { firstName, lastName, mobile } = addLeadTicketRequest;
        const { ticketSystem } = config.za;
        try {
            const { body } = await this._zaApi.addLeadTicket(
                'application/json',
                firstName,
                lastName,
                mobile,
                ticketSystem,
            );
            return body.data as number;
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to add a lead ticket with message: ${exception.body ? exception.body.error : exception}`,
                fnc,
                {
                    addLeadTicketRequest,
                    body: exception.body,
                    stack: exception.stack,
                },
            );

            // If the error is that the lead already exists, allow it
            if (exception.body.errorCode === config.za.errorCodes.leadExists) {
                this.logger.debug(LogChannel.ZA, 'Lead exists, but continuing anyway', fnc);
                return;
            }
            throw new Error(exception.body ? exception.body : exception);
        }
    }

    public async addUser(addUserRequest: Partial<AddUserRequest>, request: Request): Promise<GetCustomerResponseDTO> {
        const fnc = this.addUser.name;
        const headers = this.zaHeaders(request);
        this.logger.debug(LogChannel.ZA, `Adding new user`, fnc, addUserRequest);
        try {
            const { body } = await this._zaApi.addUser(addUserRequest, headers);
            return body.data[0] as GetCustomerResponseDTO;
        } catch (exception) {
            this.logger.error(LogChannel.ZA, `Failed to add new user with message`, fnc, {
                addUserRequest,
                body: exception.body,
                stack: exception.stack,
            });
            throw Error(exception.body ? exception.body : exception);
        }
    }

    public async getTicketHistory(
        getTicketHistoryDTO: GetTicketHistoryRequestDTO,
        request: Request,
    ): Promise<GetTicketResponseDTO[] | Error> {
        const fnc = this.getTicketHistory.name;
        this.logger.debug(LogChannel.ZA, `Getting ticket history`, fnc, getTicketHistoryDTO);
        const headers = this.zaHeaders({ ...request });
        const { customerId } = getTicketHistoryDTO;
        const { ticketSystem } = config.za;
        try {
            const { body } = await this._zaApi.getTicketHistory(+customerId, ticketSystem, headers);
            const tickets: TicketModel[] = body.data as TicketModel[];
            this.logger.debug(LogChannel.ZA, `Retrieved ${tickets.length} tickets`, fnc);
            return await Promise.all(tickets.map(ticket => this.generateTicketResponse(ticket, request))).catch(
                error => error,
            );
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Ticket history failed with message: ${exception.body ? exception.body.error : exception}`,
                fnc,
                {
                    getTicketHistoryDTO,
                    body: exception.body,
                    stack: exception.stack,
                },
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    private async generateTicketResponse(ticket: TicketModel, request: Request): Promise<GetTicketResponseDTO> {
        const fnc = this.generateTicketResponse.name;
        try {
            this.logger.debug(LogChannel.ZA, `Retrieving documents for ticket ${ticket.ticketData.id}`, fnc);
            const documents = await this.getDocumentsByTicketId(ticket.ticketData.id, request);
            if (documents instanceof Error) {
                this.logger.error(
                    LogChannel.ZA,
                    `Document error for ticket ${ticket.ticketData.id} with message ${documents.message}`,
                    fnc,
                    {
                        ticket,
                        stack: documents.stack,
                    },
                );
                throw new Error(documents.message);
            }
            return {
                ...this.modifyTicketData(ticket.ticketData),
                documents,
                questionsAndAnswers:
                    typeof ticket.questionsAndAnswers === 'string'
                        ? JSON.parse(ticket.questionsAndAnswers)
                        : ticket.questionsAndAnswers,
            };
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Document exception for ticket ${ticket.ticketData.id} with message ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                {
                    ticket,
                    body: exception.body,
                    stack: exception.stack,
                },
            );
            throw new Error(exception.body ? exception.body : exception);
        }
    }

    public async getCourtHouses(): Promise<CourthouseModel[] | Error> {
        const fnc = this.getCourtHouses.name;
        try {
            const { body } = await this._zaApi.getCourthouseList(0, '');
            return _.orderBy(body.data as CourthouseModel[], 'name', 'asc');
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to get courthouses with error: ${exception.body ? exception.body.error : exception}`,
                fnc,
                exception.stack,
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async addTicket(addTicketRequest: AddTicketRequestDTO, request: Request) {
        const fnc = this.addTicket.name;
        const headers = this.zaHeaders({ ...request });
        const { ticketSystem, countryCode } = config.za;

        const _addTicketRequest: Partial<AddTicketRequest> = {
            customerId: addTicketRequest.customerId,
            ticketSystem,
            country: countryCode,
            currency: 'ILS',
            partner: addTicketRequest.partner,
        };
        this.logger.debug(LogChannel.ZA, `Adding a new ticket`, fnc, _addTicketRequest);

        try {
            const { body } = await this._zaApi.addTicket(_addTicketRequest, headers);
            const response: GetTicketResponseDTO = {
                ...this.modifyTicketData(body.ticketDataMap),
                documents: [],
                questionsAndAnswers: [],
            };
            return response;
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to add a new ticket with error: ${exception.body ? exception.body.error : exception}`,
                fnc,
                { addTicketRequest: _addTicketRequest, body: exception.body, stack: exception.stack },
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async updateTicket(updateTicketRequest: UpdateTicketRequestDTO, request: Request) {
        const fnc = this.updateTicket.name;
        this.logger.debug(LogChannel.ZA, `Updating ticket`, fnc, updateTicketRequest);
        const headers = this.zaHeaders({ ...request });
        const { ticketSystem, countryCode } = config.za;
        let { violationDate } = updateTicketRequest;
        const { violationTime, violationCity, violationAddress, violationHouseNumber } = updateTicketRequest;
        violationDate = `${moment(violationDate).format('YYYY-MM-DD')} ${violationTime}:00`;

        let selectedCourtHouse;
        try {
            const courtHouseList = await this.getCourtHouses();
            if (courtHouseList instanceof Error) {
                return courtHouseList as Error;
            }

            selectedCourtHouse = courtHouseList.find(
                ch =>
                    ch.name.trim().toLowerCase().includes(violationCity.trim().toLowerCase()) ||
                    ch.City.trim().toLowerCase().includes(violationCity.trim().toLowerCase()),
            );

            if (!selectedCourtHouse) {
                this.logger.error(
                    LogChannel.ZA,
                    `Could not find the courthouse for the violation city ${violationCity}`,
                    fnc,
                );
                return new Error('Unable to find Courthouse');
            }
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to retrieve and select courthouse with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                { updateTicketRequest, body: exception.body, stack: exception.stack },
            );
            return new Error('Unable to find Courthouse');
        }
        const _updateTicketRequest: Partial<UpdateTicketRequest> = {
            ticketType: updateTicketRequest.ticketType,
            ticketStatus: updateTicketRequest.ticketStatus,
            citationNo: updateTicketRequest.citationNo,
            country: countryCode,
            licensePlate: updateTicketRequest.licensePlate,
            courthouse: selectedCourtHouse.id.toString(),
            violationDate,
            violationCodes: updateTicketRequest.violationCodes,
            institutionId: updateTicketRequest.institutionId || '1',
            modelCode: updateTicketRequest.modelType,
            modelType: updateTicketRequest.modelType,
            makeCode: updateTicketRequest.vehicleMake,
            vehicleMake: updateTicketRequest.vehicleMake,
            vehicleYear: updateTicketRequest.vehicleYear ? updateTicketRequest.vehicleYear : '2019',
            city: updateTicketRequest.violationCity,
            address: violationHouseNumber ? `${violationAddress}_${violationHouseNumber}` : violationAddress,
            violationId: updateTicketRequest.violationId || '',
            customerId: updateTicketRequest.customerId,
            ticketSystem,
            transactionState: updateTicketRequest.transactionState,
            amount: updateTicketRequest.amount,
            currency: 'ILS',
            id: updateTicketRequest.id.toString(),
            hasMembership: updateTicketRequest.hasMembership,
            paymentRefNumber: updateTicketRequest.paymentRefNumber,
            finished: false,
            questionsAndAnswers: [...updateTicketRequest.questionsAndAnswers],
        };
        this.logger.debug(LogChannel.ZA, `Updating ticket`, fnc, {
            updateTicketRequest: _updateTicketRequest,
            selectedCourtHouse,
        });

        try {
            const { body } = await this._zaApi.updateTicket(_updateTicketRequest, headers);
            if (body.error) {
                throw new Error(body.error);
            }
            this.logger.debug(LogChannel.ZA, `Updated ticket successfully`, fnc, body);

            // Update local database
            await this.updateTicketsService.updateTicket(_updateTicketRequest);

            const response: GetTicketResponseDTO = {
                ...body.ticketDataMap,
                documents: await this.getDocumentsByTicketId(+updateTicketRequest.id, request),
                questionsAndAnswers: [...body.questionsAndAnswers],
            };
            return response;
        } catch (exception) {
            this.logger.error(LogChannel.ZA, `Failed to update ticket.`, fnc, {
                updateTicketRequest: _updateTicketRequest,
                body: exception.body ? exception.body.error : exception,
                stack: exception.stack,
            });
            return new Error(`Could not update ticket. Please contact support.`);
        }
    }

    public async getQuestionsAndAnswers(
        questionsAndAnswersRequest: GetQuestionsAndAnswersRequestDTO,
        request: Request,
    ): Promise<any | Error> {
        const fnc = this.getQuestionsAndAnswers.name;
        this.logger.debug(LogChannel.ZA, `Getting questions and answers`, fnc, questionsAndAnswersRequest);
        const { ticketId } = questionsAndAnswersRequest;
        const headers = this.zaHeaders({ ...request });
        try {
            const { body } = await this._zaApi.getAllTicketQuestionsAndAnswers(ticketId, headers);
            return body.data;
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to get questions and answers with the following message: ${
                    exception.body ? (exception.body ? exception.body.error : exception) : exception.message
                }`,
                fnc,
                { questionsAndAnswersRequest, body: exception.body, stack: exception.stack },
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async getTicketStatus(request: Request): Promise<TicketStatusModel[] | Error> {
        const fnc = this.getTicketStatus.name;
        const headers = this.zaHeaders({ ...request });
        try {
            const { body } = await this._zaApi.getTicketStatusList(0, 100, headers);
            return body.data as TicketStatusModel[];
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to get the ticket status with message: ${exception.body ? exception.body.error : exception}`,
                fnc,
                exception.stack,
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async getTicketDocumentTypeList(request: Request): Promise<DocumentTypeModel[] | Error> {
        const fnc = this.getTicketDocumentTypeList.name;
        const headers = this.zaHeaders({ ...request });
        try {
            const { body } = await this._zaApi.getTicketDocumentTypeList(0, 100, headers);
            return body.data as DocumentTypeModel[];
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to get the document type list with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                exception.stack,
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async getDocumentsByTicketId(ticketId: number, request: Request): Promise<DocumentModel[] | Error> {
        const fnc = this.getDocumentsByTicketId.name;
        this.logger.debug(LogChannel.ZA, `Getting documents for ticket id ${ticketId}`, fnc, ticketId);
        const headers = this.zaHeaders({ ...request });
        try {
            const { body } = await this._zaApi.listTicketsDocumentsByTicketId(ticketId, headers);
            return body.data as DocumentModel[];
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to get documents for ticket id ${ticketId} with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                { ticketId, body: exception.body, stack: exception.stack },
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async uploadTicketDocument(
        ticketId: number,
        document: UploadTicketDocumentRequestDTO,
        request: Request,
    ): Promise<DocumentModel | Error> {
        const fnc = this.uploadTicketDocument.name;
        this.logger.debug(LogChannel.ZA, `Updating documents for ticket id ${ticketId}`, fnc, ticketId);
        const headers = this.zaHeaders({ ...request });
        const uploadTicketDocumentRequest: UploadTicketDocumentRequest = {
            ticketId: +ticketId,
            ...document,
        };
        try {
            const { body } = await this._zaApi.uploadTicketDocument(uploadTicketDocumentRequest, headers);
            const document = body.data as DocumentModel;
            // Update local appeal
            await this.editAppealService.uploadAppealDocument(ticketId, document);
            return document;
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to update documents for ticket id ${ticketId} with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                { ticketId, body: exception.body, stack: exception.stack },
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async updateCustomerProfile(
        customerId: number,
        updateCustomerProfileRequest: UpdateCustomerProfileRequest,
        request: Request,
    ): Promise<GetCustomerResponseDTO | Error> {
        const fnc = this.updateCustomerProfile.name;
        const headers = this.zaHeaders({ ...request });
        const _updateCustomerProfileRequest: UpdateCustomerProfileRequest = {
            customerId: customerId.toString(),
            ...updateCustomerProfileRequest,
        };

        this.logger.debug(LogChannel.ZA, `Updating customer profile`, fnc, {
            updateCustomerProfileRequest: _updateCustomerProfileRequest,
        });

        try {
            const { body } = await this._zaApi.updateCustomerProfile(_updateCustomerProfileRequest, headers);
            return body.data[0] as GetCustomerResponseDTO;
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to update the customer profile with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                {
                    updateCustomerProfileRequest: _updateCustomerProfileRequest,
                    body: exception.body,
                    stack: exception.stack,
                },
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async generateTicketDefence(
        ticketId: number,
        customParagraphs: string,
        request: Request,
    ): Promise<{ url: string } | Error> {
        const fnc = this.generateTicketDefence.name;
        this.logger.debug(LogChannel.ZA, `Generating ticket defence for ticket ${ticketId}`, fnc, {
            ticketId,
            customParagraphs,
        });
        await this.editAppealService.updateCustomParagraphs(ticketId, customParagraphs);
        const headers = this.zaHeaders({ ...request });
        try {
            const { body } = await this._zaApi.generateTicketDefense(
                {
                    ticketId: ticketId.toString(),
                    customParagraphs,
                },
                headers,
            );
            return { url: body.documentSignedURL };
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Error generating ticket defence for ticket ${ticketId} with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                {
                    ticketId,
                    customParagraphs,
                    body: exception.body,
                    stack: exception.stack,
                },
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async deleteTicket(ticketId: number, request: Request): Promise<void | Error> {
        const fnc = this.deleteTicket.name;
        this.logger.debug(LogChannel.ZA, `Deleting ticket with id ${ticketId}`, fnc);
        const headers = this.zaHeaders({ ...request });
        try {
            await this._zaApi.deleteTickets([ticketId], headers);
            await this.updateTicketsService.deleteTicketAndAppeal(ticketId);
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Error deleting ticket with id ${ticketId} with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                exception.stack,
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async deleteDocument(documentId: number, request: Request): Promise<void | Error> {
        const fnc = this.deleteDocument.name;
        this.logger.debug(LogChannel.ZA, `Deleting document with id ${documentId}`, fnc);
        const headers = this.zaHeaders({ ...request });
        try {
            await this._zaApi.deleteTicketDocumentsByDocumentId(documentId, headers);
        } catch (exception) {
            this.logger.error(
                LogChannel.ZA,
                `Error deleting document with id ${documentId} with message: ${
                    exception.body ? exception.body.error : exception
                }`,
                fnc,
                exception.stack,
            );
            return new Error(exception.body ? exception.body : exception);
        }
    }

    public async updateTicketStatus(
        customerId: number,
        ticketId: string,
        ticketStatus: string,
        request: Request,
        data?: any,
    ) {
        const fnc = this.updateTicketStatus.name;
        const headers = this.zaHeaders(request);
        const { ticketSystem } = config.za;

        const ticketStatusList = await this.getTicketStatus(request);
        if (ticketStatusList instanceof Error) {
            return ticketStatusList as Error;
        }
        const zaTicketStatus = ticketStatusList.find(status =>
            status.name.trim().toLowerCase().includes(ticketStatus.trim().toLowerCase()),
        );

        if (!zaTicketStatus) {
            return new Error(`No ticket status id found for status ${ticketStatus}`);
        }

        let updateRequest: Partial<UpdateTicketRequest> = {
            id: ticketId,
            ticketStatus: zaTicketStatus.id,
            customerId: customerId.toString(),
            ticketSystem,
        };
        await this.editTicketService.editTicketStatus(ticketId, zaTicketStatus);
        if (ticketStatus === TicketStatus.PAID_CREDIT_CARD && data && typeof data === 'string') {
            updateRequest = {
                ...updateRequest,
                paymentRefNumber: data,
                amountPaid: +config.appealCost.amountInShekels,
            };
            this.logger.debug(
                LogChannel.PAYMENT,
                `Updating local database for a successful payment`,
                fnc,
                updateRequest,
            );
            await this.updatePaymentsService.successfulPayment(updateRequest);
        }
        this.logger.debug(LogChannel.ZA, `Updating ticket status`, fnc, updateRequest);
        try {
            const { body } = await this._zaApi.updateTicket(updateRequest, headers);
            if (body.error) {
                return new Error(body.error);
            }
            let documents = await this.getDocumentsByTicketId(+ticketId, request);
            if (documents instanceof Error) {
                documents = [];
            }
            const response: GetTicketResponseDTO = {
                ...body.ticketDataMap,
                documents,
                questionsAndAnswers: body.questionsAndAnswers,
            };
            return response;
        } catch (exception) {
            const body = exception.body || {};
            const error = body.error || '';
            this.logger.error(LogChannel.ZA, `Error updating ticket status with message: ${error}`, fnc, {
                updateRequest,
                body: exception.body,
                stack: exception.stack,
            });
            return new Error(error);
        }
    }

    private async sendToCourthouse(
        courthouse: CourthouseModel,
        citationNo: string,
        serverFileUrl: string,
        localFilepath: string,
        htmlBody: string = '',
        userEmail?: string,
    ) {
        const fnc = this.sendToCourthouse.name;
        this.logger.debug(LogChannel.ZA, `Sending appeal to the courthouse`, fnc, {
            courthouse,
            citationNo,
            serverFileUrl,
            localFilepath,
        });
        if (courthouse['Fax/Mail'].includes('@')) {
            this.logger.debug(LogChannel.ZA, `Sending via email`, fnc);
            const buffer = readFileSync(localFilepath, { encoding: 'base64' });
            const attachment = this.postmarkService.createPDFAttachment(citationNo, buffer);
            const message = this.postmarkService.composeMessage(
                citationNo,
                htmlBody,
                courthouse['Fax/Mail'],
                [attachment],
                undefined,
                userEmail,
                config.postmark.appealBcc,
            );
            const sent = await this.postmarkService.sendEmail(message);
        } else {
            this.logger.debug(LogChannel.ZA, `Sending via fax`, fnc);
            const faxRequest: SendFaxRequestDTO = {
                faxNumber: courthouse['Fax/Mail'],
                fileUrl: serverFileUrl,
            };
            await this.faxService.send(faxRequest);
        }
    }

    private async sendConfirmationToCustomer(
        user: CustomerModel,
        ticket: GetTicketResponseDTO,
        fileUrl: string,
    ): Promise<boolean> {
        const fnc = this.sendConfirmationToCustomer.name;
        const { email, israelIdNumber, firstName } = user;
        const { citationNo, paymentRefNumber } = ticket;
        const { from } = config.postmark;
        this.logger.debug(LogChannel.ZA, `Sending confirmation email to customer`, fnc, {
            email,
            israelIdNumber,
            firstName,
            citationNo,
            paymentRefNumber,
            from,
        });
        const buffer = readFileSync(fileUrl, { encoding: 'base64' });
        const pdfFile = this.postmarkService.createPDFAttachment(citationNo, buffer);
        const imagesAttachments = customerTemplateMetadata.map(({ buffer, mimeType, name }) =>
            this.postmarkService.createImageAttachment(name, buffer, mimeType, name),
        );
        const templateModel = {
            user: {
                firstName,
                israelIdNumber,
            },
            currentDate: moment(new Date()).format('DD.MM.YYYY'),
            ticket: {
                citationNo,
                paymentRefNumber,
            },
        };
        const message = this.postmarkService.composeTemplatedMessage(
            from,
            email,
            [...imagesAttachments, pdfFile],
            templateModel,
        );
        return await this.postmarkService.sendEmailWithTemplate(message);
    }

    public async submitAppeal(
        ticketId: string,
        submitAppealRequest: SubmitAppealRequestDTO,
        request: Request,
        socket?: Namespace,
    ) {
        const fnc = this.submitAppeal.name;
        const { ticket, customParagraphs, user } = submitAppealRequest;
        const { citationNo, courthouse } = ticket;
        const { id } = user;

        this.logger.debug(LogChannel.ZA, `Submitting appeal for ticket ${ticketId}`, fnc, {
            ticket,
            customParagraphs,
            user,
            citationNo,
            courthouse,
            id,
        });

        const ticketDefenseResponse = await this.generateTicketDefence(+ticketId, customParagraphs, request);
        if (ticketDefenseResponse instanceof Error) {
            this.logger.error(
                LogChannel.ZA,
                `Failed to submit appeal for ticket ${ticketId} with message: ${ticketDefenseResponse.message}`,
                fnc,
                {
                    ticket,
                    customParagraphs,
                    user,
                    citationNo,
                    courthouse,
                    id,
                    stack: ticketDefenseResponse.stack,
                },
            );
            return new Error(ticketDefenseResponse.message);
        }
        const url = ticketDefenseResponse.url;
        const currentTime = new Date().getTime();
        const filename = `${currentTime}_${citationNo}.pdf`;
        const localFilepath = join(config.paths.temp(), filename);
        const file = createWriteStream(localFilepath);
        file.on('close', async () => {
            const courthouseResponse = await this.getCourtHouses();
            if (courthouseResponse instanceof Error) {
                return new Error(courthouseResponse.message);
            }
            let courthouseModel = courthouseResponse.find(ch => ch.id === courthouse);
            if (courthouseModel) {
                // Copy it so that we don't use the original data
                courthouseModel = { ...courthouseModel };
                // TODO: Refactor this where we redirect appeals to a different
                // email address for testing
                if (getENV() !== EnvironmentOptions.production) {
                    this.logger.debug(
                        LogChannel.ZA,
                        `Not in the production environment so we're replacing the courthouse email with ${config.postmark.testEmail}`,
                        fnc,
                    );
                    courthouseModel['Fax/Mail'] = config.postmark.testEmail;
                }
                const { protocol, host } = request;
                const { port } = config.app;
                const fileUrl = `${protocol}://${host}:${port}/temp/${currentTime}_${citationNo}.pdf`;
                const htmlBody = await this.generateHtmlBody(user, filename);
                await this.sendToCourthouse(courthouseModel, citationNo, fileUrl, localFilepath, htmlBody, user.email);
            } else {
                this.logger.error(
                    LogChannel.ZA,
                    `Failed to submit appeal for ticket ${ticketId} because the courthouse was not found.`,
                    fnc,
                    {
                        ticket,
                        customParagraphs,
                        user,
                        citationNo,
                        courthouse,
                        id,
                    },
                );
                return new Error('Unable to find the specified court house');
            }
            await this.sendConfirmationToCustomer(user, ticket, localFilepath);
            await this.updateTicketStatus(id, ticketId, TicketStatus.SENT_TO_MUNICIPALITY, request);
            unlinkSync(localFilepath);

            if (socket) {
                this.logger.info(
                    LogChannel.SOCKET,
                    'Successfully sent appeal to the Municipality',
                    this.submitAppeal.name,
                );
                this.clientNotificationService.notify(socket, {
                    message: `הערעור נשלח בהצלחה!`,
                });
            }
        });

        https.get(url, response => response.on('data', data => file.write(data)).on('end', () => file.end()));
    }

    private async generateHtmlBody(user: CustomerModel, filename: string): Promise<string> {
        const raw = await fs
            .readFile(path.resolve(__dirname, './appeal-email.hbs'))
            .then(template => template.toString());
        const template = Handlebars.compile(raw);
        return template({ user, filename });
    }
}
