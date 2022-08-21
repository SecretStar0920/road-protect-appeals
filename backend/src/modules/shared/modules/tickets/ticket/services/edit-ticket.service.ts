import { LoggerService } from '@logger';
import { LogChannel } from '../../../../../../config/logs';
import { Ticket } from '@database/entities/ticket.entity';
import { CreateTicketDto } from '../dtos/create-ticket.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateTicketRequest } from '../../../../../../apis/ZA/model/update-ticket-request';
import { GetTicketService } from './get-ticket.service';
import { GetUserService } from '../../../user/services/get-user/get-user.service';
import { Appeal } from '@database/entities/appeal.entity';
import { UpdateTicketHistoryService } from './update-ticket-history.service';
import { EditTicketDto } from '../dtos/edit-ticket.dto';
import { TicketStatusModel } from '../../../../../../models/ticket-status.model';
import moment from 'moment';
import { UpdateUserLogsService } from '../../../user/services/user-logs/update-user-logs.service';
import { GetMunicipalityService } from '../../../municipality/services/get-municipality.service';
import { EditVehicleService } from '../../../vehicle/services/edit-vehicle.service';

@Injectable()
export class EditTicketService {
    constructor(
        private logger: LoggerService,
        private getTicketService: GetTicketService,
        private getUserService: GetUserService,
        private editVehicleService: EditVehicleService,
        private ticketHistoryService: UpdateTicketHistoryService,
        private getMunicipalityService: GetMunicipalityService,
        private userLogService: UpdateUserLogsService,
    ) {}

    async createTicketFromUpdateTicketRequest(updateTicketRequest: Partial<UpdateTicketRequest>, appeal: Appeal) {
        const newTicket = await this.convertUpdateTicketRequest(updateTicketRequest, appeal);
        return await this.create(newTicket);
    }

    async create(dto: CreateTicketDto): Promise<Ticket> {
        const fnc = this.create.name;
        this.logger.debug(LogChannel.TICKET, `Creating local ticket`, fnc);
        const ticket = Ticket.create(dto);

        try {
            await ticket.save();
            await this.ticketHistoryService.createTicket(ticket);
            await this.userLogService.addTicketSuccess(dto.user, ticket);
            return ticket;
        } catch (e) {
            this.logger.error(LogChannel.TICKET, `Failed to create ticket: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            // Adding to user logs
            await this.userLogService.addTicketFail(dto.user, e);
            throw new InternalServerErrorException('Failed to create ticket.');
        }
    }

    async checkCitationUpdate(updateTicketRequest: Partial<UpdateTicketRequest>) {
        const fnc = this.checkCitationUpdate.name;
        this.logger.debug(LogChannel.TICKET, `Checking if citation was updated`, fnc);

        if (!updateTicketRequest.id) {
            this.logger.error(LogChannel.TICKET, `No ticket id given`, fnc, updateTicketRequest);
            throw new InternalServerErrorException('No ticket id given');
        }

        return await this.getTicketService.getByRoadProtectId(+updateTicketRequest.id);
    }

    private async convertUpdateTicketRequest(
        updateTicketRequest: Partial<UpdateTicketRequest>,
        appeal: Appeal,
    ): Promise<CreateTicketDto> {
        const fnc = this.convertUpdateTicketRequest.name;

        if (!updateTicketRequest.citationNo || !updateTicketRequest.customerId) {
            this.logger.error(LogChannel.TICKET, `No citation number or customerId given`, fnc, updateTicketRequest);
            throw new InternalServerErrorException('No citation number or customerId given');
        }

        const user = await this.getUserService.getByCustomerId(+updateTicketRequest.customerId);
        if (!user) {
            this.logger.error(LogChannel.TICKET, `Could not find user`, fnc, user);
            throw new InternalServerErrorException('Could not find user');
        }

        const newTicket: CreateTicketDto = {
            citationNo: updateTicketRequest.citationNo,
            user,
            violation: {
                code: updateTicketRequest.violationCodes ? updateTicketRequest.violationCodes : '',
                date: updateTicketRequest.violationDate ? updateTicketRequest.violationDate : '',
                amount: updateTicketRequest.amount ? updateTicketRequest.amount : '',
            },
            details: updateTicketRequest,
            appeals: [appeal],
        };

        return (await this.updateTicketOptionalVariables(newTicket, updateTicketRequest)) as CreateTicketDto;
    }

    private async updateTicketOptionalVariables(
        localTicket: EditTicketDto,
        updateTicketRequest: Partial<UpdateTicketRequest>,
    ) {
        if (updateTicketRequest.ticketStatus) {
            const status = {
                id: updateTicketRequest.ticketStatus,
                name: '',
            };
            localTicket.status = status;
        }

        if (updateTicketRequest.licensePlate && updateTicketRequest.modelType && updateTicketRequest.vehicleMake) {
            const vehicle = await this.editVehicleService.updateVehicle(
                updateTicketRequest.licensePlate,
                updateTicketRequest.modelType,
                updateTicketRequest.vehicleMake,
            );
            if (vehicle) {
                localTicket.vehicle = vehicle;
            }
        }

        if (updateTicketRequest.courthouse) {
            const municipality = await this.getMunicipalityService.getMunicipalityByCourthouseId(
                +updateTicketRequest.courthouse,
            );
            if (municipality) {
                localTicket.municipality = municipality;
            }
        }
        return localTicket;
    }

    async updateTicket(localTicket: Ticket, dto: EditTicketDto) {
        const fnc = this.updateTicket.name;
        this.logger.debug(LogChannel.TICKET, `Updating local ticket roadProtectId: [${localTicket.ticketId}]`, fnc);
        const oldTicket = await this.ticketHistoryService.toTicketInterface(localTicket);
        localTicket.citationNo = dto.citationNo ? dto.citationNo : localTicket.citationNo;
        localTicket.violation.code = dto.violationCode ? dto.violationCode : localTicket.violation.code;
        localTicket.violation.date = dto.violationDate ? dto.violationDate : localTicket.violation.date;
        localTicket.violation.amount = dto.violationAmount ? dto.violationAmount : localTicket.violation.amount;
        localTicket.status = dto.status ? dto.status : localTicket.status;
        localTicket.deletedAt = dto.deletedAt ? dto.deletedAt : localTicket.deletedAt;
        localTicket.vehicle = dto.vehicle ? dto.vehicle : localTicket.vehicle;
        localTicket.municipality = dto.municipality ? dto.municipality : localTicket.municipality;
        localTicket.details = dto.details;

        try {
            await localTicket.save();
            this.logger.debug(LogChannel.TICKET, `Successfully updated local ticket`, fnc);
            const editedTicket = await this.ticketHistoryService.toTicketInterface(localTicket);
            if (dto.deletedAt) {
                await this.ticketHistoryService.deletedTicket(oldTicket, editedTicket);
            } else {
                await this.ticketHistoryService.editTicket(oldTicket, editedTicket);
            }
            this.logger.debug(LogChannel.TICKET, `Successfully updated local ticket`, fnc);
            await this.userLogService.editTicketSuccess(localTicket);
            return localTicket;
        } catch (e) {
            this.logger.error(LogChannel.TICKET, `Failed to edit ticket: ${e.message}`, fnc, {
                localTicket,
                stack: e.stack,
            });
            await this.userLogService.editTicketFail(localTicket, e);
            throw new InternalServerErrorException('Failed to edit ticket.');
        }
    }

    async editLocalTicket(localTicket: Ticket, updateTicketRequest: Partial<UpdateTicketRequest>) {
        const fnc = this.editLocalTicket.name;
        this.logger.debug(LogChannel.TICKET, `Updating local ticket roadProtectId: [${localTicket.ticketId}]`, fnc);
        const editDto: EditTicketDto = {};
        if (updateTicketRequest.citationNo) {
            editDto.citationNo = updateTicketRequest.citationNo;
        }
        if (updateTicketRequest.violationCodes) {
            editDto.violationCode = updateTicketRequest.violationCodes;
        }
        if (updateTicketRequest.violationDate) {
            editDto.violationDate = updateTicketRequest.violationDate;
        }
        if (updateTicketRequest.amount) {
            editDto.violationAmount = updateTicketRequest.amount;
        }
        const updatedEditDto = await this.updateTicketOptionalVariables(editDto, updateTicketRequest);
        updatedEditDto.details = updateTicketRequest;
        return this.updateTicket(localTicket, updatedEditDto);
    }

    async editTicketStatus(roadProtectId: string, status: TicketStatusModel) {
        const fnc = this.editTicketStatus.name;
        this.logger.debug(LogChannel.TICKET, `Updating local ticket status roadProtectId: [${roadProtectId}]`, fnc);

        const localTicket = await this.getTicketService.getByRoadProtectId(+roadProtectId);

        if (!localTicket) {
            this.logger.error(LogChannel.TICKET, `Could not edit ticket status, ticket not found`, fnc, roadProtectId);
            throw new InternalServerErrorException('Failed to edit ticket status.');
        }

        const editDto: EditTicketDto = {
            status,
        };
        return this.updateTicket(localTicket, editDto);
    }

    async deleteLocalTicket(roadProtectId: number) {
        const fnc = this.deleteLocalTicket.name;
        this.logger.debug(LogChannel.TICKET, `Deleting local ticket for roadProtectId: [${roadProtectId}]`, fnc);
        const localTicket = await this.getTicketService.getByRoadProtectId(roadProtectId);

        if (!localTicket) {
            this.logger.debug(LogChannel.TICKET, `No local ticket found for roadProtectId: [${roadProtectId}]`, fnc);
            return;
        }
        const dto: EditTicketDto = {
            deletedAt: moment(),
        };
        return await this.updateTicket(localTicket, dto);
    }
}
