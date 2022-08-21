import { LoggerService } from '@logger';
import { LogChannel } from '../../../../../../config/logs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAppealDto } from '../dtos/create-appeal.dto';
import { Appeal } from '@database/entities/appeal.entity';
import { GetAppealService } from './get-appeal.service';
import { EditApealDto, EditAppealDetails } from '../dtos/edit-apeal.dto';
import { UpdateTicketRequest } from '../../../../../../apis/ZA/model/update-ticket-request';
import { DocumentModel } from '../../../../../../models/document.model';
import moment from 'moment';
import { UpdateUserLogsService } from '../../../user/services/user-logs/update-user-logs.service';

@Injectable()
export class EditAppealService {
    constructor(
        private logger: LoggerService,
        private getAppealService: GetAppealService,
        private userLogService: UpdateUserLogsService,
    ) {}

    async createAppealFromUpdateTicketRequest(updateTicketRequest: Partial<UpdateTicketRequest>) {
        const newAppeal = await this.convertUpdateTicketRequest(updateTicketRequest);
        return await this.create(newAppeal);
    }

    async create(dto: CreateAppealDto): Promise<Appeal> {
        const fnc = this.create.name;
        this.logger.debug(LogChannel.APPEAL, `Creating local appeal`, fnc, dto);
        const appeal = Appeal.create(dto);

        try {
            await appeal.save();
            await this.userLogService.createAppealSuccess(dto.customerId, appeal);
            return appeal;
        } catch (e) {
            this.logger.debug(LogChannel.APPEAL, `Failed to create appeal: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            await this.userLogService.createAppealFail(dto.customerId, e);
            throw new InternalServerErrorException('Failed to create appeal.');
        }
    }

    private async convertUpdateTicketRequest(
        updateTicketRequest: Partial<UpdateTicketRequest>,
    ): Promise<CreateAppealDto> {
        const fnc = this.convertUpdateTicketRequest.name;

        if (!updateTicketRequest.id) {
            this.logger.debug(LogChannel.APPEAL, `No roadProtectZAId given`, fnc, updateTicketRequest);
            throw new InternalServerErrorException('No roadProtectZAId given');
        }

        const newAppeal: CreateAppealDto = {
            customerId: updateTicketRequest.customerId ? +updateTicketRequest.customerId : -1,
            details: {
                questionsAndAnswers: updateTicketRequest.questionsAndAnswers
                    ? updateTicketRequest.questionsAndAnswers
                    : [''][''],
                roadProtectZAId: updateTicketRequest.id,
            },
        };
        return newAppeal;
    }

    async updateAppeal(localAppeal: Appeal, dto: EditApealDto) {
        const fnc = this.updateAppeal.name;
        this.logger.debug(LogChannel.APPEAL, `Editing appeal [${localAppeal.appealId}]`, fnc);
        if (dto.details) {
            localAppeal.details.questionsAndAnswers = dto.details.questionsAndAnswers
                ? dto.details.questionsAndAnswers
                : localAppeal.details.questionsAndAnswers;
            localAppeal.details.roadProtectZAId = dto.details.roadProtectZAId
                ? dto.details.roadProtectZAId
                : localAppeal.details.roadProtectZAId;
            if (dto.details.documents) {
                if (!localAppeal.details.documents) {
                    localAppeal.details.documents = dto.details.documents;
                } else {
                    localAppeal.details.documents.push(...dto.details.documents);
                }
            }
        }
        if (dto.customParagraphs) {
            localAppeal.customParagraphs = dto.customParagraphs;
        }
        if (dto.deletedAt) {
            localAppeal.deletedAt = dto.deletedAt;
        }
        try {
            await localAppeal.save();
            this.logger.debug(LogChannel.APPEAL, `Successfully updated local appeal`, fnc);
            await this.userLogService.editAppealSuccess(+localAppeal.details.roadProtectZAId, dto);
            return localAppeal;
        } catch (e) {
            this.logger.error(LogChannel.APPEAL, `Failed to edit appeal: ${e.message}`, fnc, {
                localAppeal,
                dto,
                stack: e.stack,
            });
            await this.userLogService.editAppealFail(+localAppeal.details.roadProtectZAId, dto, e);
            throw new InternalServerErrorException('Failed to edit appeal.');
        }
    }

    async editLocalAppealDetails(localAppeal: Appeal, updateTicketRequest: Partial<UpdateTicketRequest>) {
        const fnc = this.editLocalAppealDetails.name;
        this.logger.debug(LogChannel.APPEAL, `Editing appeal details`, fnc);
        const details: EditAppealDetails = {};
        if (updateTicketRequest.questionsAndAnswers) {
            details.questionsAndAnswers = updateTicketRequest.questionsAndAnswers;
        }
        if (updateTicketRequest.id) {
            details.roadProtectZAId = updateTicketRequest.id;
        }
        const editAppealDto: EditApealDto = {
            customerId: updateTicketRequest.customerId ? +updateTicketRequest.customerId : -1,
            details,
        };
        return this.updateAppeal(localAppeal, editAppealDto);
    }

    async uploadAppealDocument(roadProtectZAId: number, document: DocumentModel) {
        const fnc = this.uploadAppealDocument.name;
        this.logger.debug(LogChannel.APPEAL, `Uploading appeal document roadProtect Id [${roadProtectZAId}]`, fnc);
        const localAppeals = await this.getAppealService.getAllByRoadProtectId(roadProtectZAId);
        if (!localAppeals || localAppeals.length > 1) {
            // At this point in time, the system can only cope with one appeal per ticket due to the dependency on the infrasonic system
            this.logger.debug(LogChannel.APPEAL, `Could not edit a local appeal or ticket, multiple appeals`, fnc);
            throw new InternalServerErrorException('Failed to edit appeal.');
        }
        const localAppeal = localAppeals[0];
        const editAppealDto: EditApealDto = {
            customerId: localAppeal.ticket.user.roadProtectZAId ? localAppeal.ticket.user.roadProtectZAId : -1,
            details: {
                documents: [document],
            },
        };
        return this.updateAppeal(localAppeal, editAppealDto);
    }

    async updateCustomParagraphs(roadProtectZAId: number, customParagraphs: string) {
        const fnc = this.updateCustomParagraphs.name;
        this.logger.debug(LogChannel.APPEAL, `Uploading appeal custom paragraphs`, fnc);
        const localAppeals = await this.getAppealService.getAllByRoadProtectId(roadProtectZAId);
        if (!localAppeals || localAppeals.length > 1) {
            // At this point in time, the system can only cope with one appeal per ticket due to the dependency on the infrasonic system
            this.logger.debug(LogChannel.APPEAL, `Could not edit a local appeal or ticket, multiple appeals`, fnc);
            throw new InternalServerErrorException('Failed to edit appeal.');
        }
        const localAppeal = localAppeals[0];
        localAppeal.customParagraphs = customParagraphs;
        const editAppealDto: EditApealDto = {
            customerId: localAppeal.ticket.user.roadProtectZAId ? localAppeal.ticket.user.roadProtectZAId : -1,
            customParagraphs,
        };
        return this.updateAppeal(localAppeal, editAppealDto);
    }

    async deleteLocalAppeal(roadProtectId: number) {
        const fnc = this.deleteLocalAppeal.name;
        this.logger.debug(LogChannel.APPEAL, `Deleting local appeals with roadProtectId: [${roadProtectId}]`, fnc);
        const localAppeals = await this.getAppealService.getAllByRoadProtectId(roadProtectId);

        if (!localAppeals || localAppeals.length < 1) {
            this.logger.debug(LogChannel.APPEAL, `No local appeal found for roadProtectId: [${roadProtectId}]`, fnc);
            return;
        }

        // This will delete all local appeals for this road protect id
        for (const appeal of localAppeals) {
            const dto: EditApealDto = {
                deletedAt: moment(),
            };
            await this.updateAppeal(appeal, dto);
        }
        this.logger.debug(
            LogChannel.APPEAL,
            `Successfully deleted appeals with roadProtectId: [${roadProtectId}]`,
            fnc,
        );
    }

    // TODO: link to payments
}
