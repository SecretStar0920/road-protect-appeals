import * as _ from 'lodash';
import { LogChannel } from '../config/logs';
import { AddTicketRequestDTO } from '../dto/add-ticket-request.dto';
import { ApiImplicitHeaders } from '@nestjs/swagger';
import { GenerateTicketDefenseRequestDTO } from '../dto/generate-ticket-defense-request.dto';
import { GetQuestionsAndAnswersRequestDTO } from '../dto/get-questions-and-answers-request.dto';
import { GetTicketHistoryRequestDTO } from '../dto/get-ticket-history-request.dto';
import { LoggerService } from '@logger';
import { MyController } from '../helpers/decorators';
import { Body, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response, response } from 'express';
import { SubmitAppealRequestDTO } from '../dto/submit-appeal-request.dto';
import { UpdateCustomerProfileRequestDTO } from '../dto/update-customer-profile-request.dto';
import { UpdateTicketRequestDTO } from '../dto/update-ticket-request.dto';
import { UploadTicketDocumentRequestDTO } from '../dto/upload-ticket-document-request.dto';
import { UpdateUserService } from '../modules/shared/modules/user/services/update-user/update-user.service';
import { GetTicketStatusNameService } from '../services/get-ticket-status-name.service';
import { ZaService } from '../services/za/za.service';
import { QuestionAndAnwserDataService } from '../services/question-and-anwser-data.service';
import { UserSocket } from '../modules/shared/decorators/user-socket.decorator';
import { Namespace } from 'socket.io';

@MyController('za', 'Za')
export default class ZaController {
    constructor(
        private readonly zaService: ZaService,
        private readonly logger: LoggerService,
        private readonly getTicketStatusNameService: GetTicketStatusNameService,
        private readonly updateUserService: UpdateUserService,
        private readonly questionAndAnswerDataService: QuestionAndAnwserDataService,
    ) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/courtHouses')
    public async getCourtHouses(@Res() response: Response) {
        const fnc = this.getCourtHouses.name;
        const courtHousesResponse = await this.zaService.getCourtHouses();
        if (courtHousesResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, courtHousesResponse.message, fnc, courtHousesResponse.stack);
            return response.status(HttpStatus.BAD_REQUEST).send(courtHousesResponse.message);
        }
        return response.status(HttpStatus.OK).send(courtHousesResponse);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/ticket/history')
    public async getTicketHistory(
        @Query() getTicketHistoryDTO: GetTicketHistoryRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.getTicketHistory.name;
        if (+getTicketHistoryDTO.customerId < 0) {
            this.logger.error(LogChannel.ZA, `Request for ticket history is unauthorized`, fnc, getTicketHistoryDTO);
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        const tickets = await this.zaService.getTicketHistory(getTicketHistoryDTO, request);
        if (tickets instanceof Error) {
            this.logger.error(LogChannel.ZA, tickets.message, fnc, { getTicketHistoryDTO, stack: tickets.stack });
            return response.status(HttpStatus.BAD_REQUEST).send(tickets.message);
        }

        const mappedTicketPromises = tickets.map(async ticket => {
            const ticketStatus = await this.getTicketStatusNameService.getTicketStatusName(
                ticket.ticketStatus,
                request,
            );
            return {
                ...ticket,
                ticketStatusName: ticketStatus,
            };
        });
        const mappedTickets = await Promise.all(mappedTicketPromises);
        return response.status(HttpStatus.OK).send(mappedTickets);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Post('/ticket')
    public async addTicket(
        @Body() addTicketRequest: AddTicketRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.addTicket.name;
        if (+addTicketRequest.customerId < 0) {
            this.logger.error(LogChannel.ZA, `Request to add ticket is unauthorized`, fnc, addTicketRequest);
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        const addTicketResponse = await this.zaService.addTicket(addTicketRequest, request);
        if (addTicketResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, addTicketResponse.message, fnc, {
                addTicketRequest,
                stack: addTicketResponse.stack,
            });
            return response.status(HttpStatus.BAD_REQUEST).send(addTicketResponse.message);
        }
        return response.status(HttpStatus.OK).send(addTicketResponse);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Put('/ticket')
    public async updateTicket(
        @Body() updateTicketRequest: UpdateTicketRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.updateTicket.name;
        if (+updateTicketRequest.customerId < 0) {
            this.logger.error(LogChannel.ZA, `Request to update ticket is unauthorized`, fnc, updateTicketRequest);
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        const updateTicketResponse = await this.zaService.updateTicket(updateTicketRequest, request);
        if (updateTicketResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, updateTicketResponse.message, fnc, {
                updateTicketRequest,
                stack: updateTicketResponse.stack,
            });
            return response.status(HttpStatus.BAD_REQUEST).send(updateTicketResponse.message);
        }
        return response.status(HttpStatus.OK).send(updateTicketResponse);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/ticket/qna')
    public async getQuestionsAndAnswers(
        @Query() getQuestionsAndAnswersRequest: GetQuestionsAndAnswersRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.getQuestionsAndAnswers.name;
        if (getQuestionsAndAnswersRequest.ticketId < 0) {
            this.logger.error(
                LogChannel.ZA,
                `Request for ticket qna is unauthorized`,
                fnc,
                getQuestionsAndAnswersRequest,
            );
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        const getQNAresponse = await this.zaService.getQuestionsAndAnswers(getQuestionsAndAnswersRequest, request);
        if (getQNAresponse instanceof Error) {
            this.logger.error(LogChannel.ZA, getQNAresponse.message, fnc, {
                getQuestionsAndAnswersRequest,
                stack: getQNAresponse.stack,
            });
            return response.status(HttpStatus.BAD_REQUEST).send(getQNAresponse.message);
        }
        const manipulatedQNAdata = this.questionAndAnswerDataService.modifyQuestionsAndAnswersData(getQNAresponse);
        return response.status(HttpStatus.OK).send(manipulatedQNAdata);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/ticket/status-list')
    public async getTicketStatusList(@Req() request: Request, @Res() response: Response) {
        const fnc = this.getTicketStatusList.name;
        const ticketStatusResponse = await this.zaService.getTicketStatus(request);
        if (ticketStatusResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, ticketStatusResponse.message, fnc, ticketStatusResponse.stack);
            return response.status(HttpStatus.BAD_REQUEST).send(ticketStatusResponse.message);
        }
        return response.status(HttpStatus.OK).send(ticketStatusResponse);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/ticket/:id/documents')
    public async getDocumentsByTicketId(@Param('id') ticketId: number, @Req() request: Request) {
        const fnc = this.getDocumentsByTicketId.name;
        const documents = await this.zaService.getDocumentsByTicketId(ticketId, request);
        if (documents instanceof Error) {
            this.logger.error(LogChannel.ZA, documents.message, fnc, { ticketId, stack: documents.stack });
            return response.status(HttpStatus.BAD_REQUEST).send(documents.message);
        }
        return documents.filter(document => document.typeCode !== '1000');
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/ticket/:id/documents/pdf/latest')
    public async getLatestDocumentsByTicketId(
        @Param('id') ticketId: number,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.getLatestDocumentsByTicketId.name;
        const documents = await this.zaService.getDocumentsByTicketId(ticketId, request);
        if (documents instanceof Error) {
            this.logger.error(LogChannel.ZA, documents.message, fnc, { ticketId, stack: documents.stack });
            return response.status(HttpStatus.BAD_REQUEST).send(documents.message);
        }
        const pdfDocuments = documents.filter(document => document.typeCode === '1000');
        const latestPdf = _.orderBy(pdfDocuments, 'dateCreated', 'desc')[0];
        if (!latestPdf) {
            this.logger.error(LogChannel.ZA, `No latest pdf found for ticket with id ${ticketId}`, fnc, ticketId);
            return response.sendStatus(HttpStatus.NO_CONTENT);
        }
        return response.status(HttpStatus.OK).send({ url: latestPdf.signedUrl });
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Delete('/ticket/:id')
    public deleteTicket(@Param('id') ticketId: number, @Req() request: Request) {
        const fnc = this.deleteTicket.name;
        this.logger.debug(LogChannel.ZA, `Deleting ticket with ID ${ticketId}`, fnc);
        return this.zaService.deleteTicket(ticketId, request);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/document/types')
    public async getTicketDocumentTypeList(@Req() request: Request, @Res() response: Response) {
        const fnc = this.getTicketDocumentTypeList.name;
        const documentTypeListResponse = await this.zaService.getTicketDocumentTypeList(request);
        if (documentTypeListResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, documentTypeListResponse.message, fnc, documentTypeListResponse.stack);
            return response.status(HttpStatus.BAD_REQUEST).send(documentTypeListResponse.message);
        }
        return response.status(HttpStatus.OK).send(documentTypeListResponse);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Post('/ticket/:id/update-status')
    public async updateTicketStatus(
        @Param('id') ticketId: string,
        @Body() updateTicketStatusRequest: { customerId: number; status: string; data?: any },
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.updateTicketStatus.name;
        const { customerId, status, data } = updateTicketStatusRequest;
        if (customerId < 0) {
            this.logger.error(LogChannel.ZA, `Ticket with id ${ticketId} is unauthorized`, fnc, {
                ticketId,
                updateTicketStatusRequest,
            });
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        try {
            const updateTicketStatusResponse = await this.zaService.updateTicketStatus(
                customerId,
                ticketId,
                status,
                request,
                data,
            );
            if (updateTicketStatusResponse instanceof Error) {
                this.logger.error(LogChannel.ZA, updateTicketStatusResponse.message, fnc, {
                    ticketId,
                    updateTicketStatusRequest,
                    stack: updateTicketStatusResponse.stack,
                });
                return response.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: updateTicketStatusResponse.message,
                });
            }
            return response.status(HttpStatus.OK).send(updateTicketStatusResponse);
        } catch (e) {
            this.logger.error(LogChannel.ZA, e.message, fnc, {
                ticketId,
                updateTicketStatusRequest,
                stack: e.stack,
            });
            throw e;
        }
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Post('/ticket/:id/upload-document')
    public async uploadTicketDocument(
        @Param('id') ticketId: number,
        @Body() document: UploadTicketDocumentRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.uploadTicketDocument.name;
        if (ticketId < 0) {
            this.logger.error(LogChannel.ZA, `Upload document for ticket ${ticketId} is unauthorized`, fnc, {
                ticketId,
                document,
            });

            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        const uploadTicketResponse = await this.zaService.uploadTicketDocument(ticketId, document, request);
        if (uploadTicketResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, uploadTicketResponse.message, fnc, {
                ticketId,
                document,
                stack: uploadTicketResponse.stack,
            });
            return response.status(HttpStatus.BAD_REQUEST).send(uploadTicketResponse.message);
        }
        return response.status(HttpStatus.OK).send(uploadTicketResponse);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-TOken', required: true }])
    @Delete('/ticket/:id/document/:documentId')
    public deleteDocumentByDocumentId(@Param('documentId') documentId: number, @Req() request: Request) {
        const fnc = this.deleteDocumentByDocumentId.name;
        this.logger.debug(LogChannel.ZA, `Deleting document with id ${documentId}`, fnc);
        return this.zaService.deleteDocument(documentId, request);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Post('/ticket/:id/generate-defense')
    public async generateTicketDefence(
        @Param('id') ticketId: number,
        @Body() generateTicketDefenseRequest: GenerateTicketDefenseRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.generateTicketDefence.name;
        if (ticketId < 0) {
            this.logger.error(LogChannel.ZA, `Generating a defence for ${ticketId} is unauthorized`, fnc, {
                ticketId,
                generateTicketDefenseRequest,
            });
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        const generateResponse = await this.zaService.generateTicketDefence(
            ticketId,
            generateTicketDefenseRequest.customParagraphs,
            request,
        );
        if (generateResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, generateResponse.message, fnc, {
                ticketId,
                generateTicketDefenseRequest,
                stack: generateResponse.stack,
            });
            return response.status(HttpStatus.BAD_REQUEST).send(generateResponse.message);
        }
        return response.status(HttpStatus.OK).send(generateResponse);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Post('/ticket/:id/submit-appeal')
    public async submitAppeal(
        @Param('id') ticketId: string,
        @Body() submitAppealRequest: SubmitAppealRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
        @UserSocket() socket: Namespace,
    ) {
        const fnc = this.submitAppeal.name;
        if (+ticketId < 0) {
            this.logger.error(LogChannel.ZA, `Submitting an appeal for ${ticketId} is unauthorized`, fnc, {
                ticketId,
                submitAppealRequest,
            });
            return response.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        const submitResponse = await this.zaService.submitAppeal(ticketId, submitAppealRequest, request, socket);
        if (submitResponse instanceof Error) {
            this.logger.error(LogChannel.ZA, submitResponse.message, fnc, {
                ticketId,
                submitAppealRequest,
                stack: submitResponse.stack,
            });
            return response.status(HttpStatus.BAD_REQUEST).send(submitResponse.message);
        }
        return response.status(HttpStatus.OK).send({ success: true });
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Put('/customer/:id')
    public async updateCustomerProfile(
        @Param('id') customerId: number,
        @Body() updateCustomerProfileRequest: UpdateCustomerProfileRequestDTO,
        @Req() request: Request,
        @Res() response: Response,
    ) {
        const fnc = this.updateCustomerProfile.name;
        const user = await this.updateUserService.updateWithRpZa(customerId, updateCustomerProfileRequest, request);
        if (user instanceof Error) {
            this.logger.error(LogChannel.ZA, user.message, fnc, {
                customerId,
                updateCustomerProfileRequest,
                stack: user.stack,
            });
            return response.status(HttpStatus.BAD_REQUEST).send(user.message);
        }
        const username = `${user.firstName}_${user.lastName}_${user.mobile}`;
        const password = user.mobile;
        const authorization = await this.zaService.getAuthorizationToken({ username, password, otpCode: '000000' });
        if (authorization instanceof Error) {
            this.logger.error(LogChannel.ZA, authorization.message, fnc, {
                customerId,
                updateCustomerProfileRequest,
                stack: authorization.stack,
            });
            return response.status(HttpStatus.UNAUTHORIZED).send(authorization.message);
        }
        return response.status(HttpStatus.OK).send({ user, authorization });
    }
}
