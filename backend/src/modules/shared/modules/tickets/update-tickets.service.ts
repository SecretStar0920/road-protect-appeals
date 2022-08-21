import { LoggerService } from '@logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EditTicketService } from './ticket/services/edit-ticket.service';
import { GetTicketService } from './ticket/services/get-ticket.service';
import { UpdateTicketRequest } from '../../../../apis/ZA/model/update-ticket-request';
import { LogChannel } from '../../../../config/logs';
import { GetAppealService } from './appeal/services/get-appeal.service';
import { EditAppealService } from './appeal/services/edit-appeal.service';

@Injectable()
export class UpdateTicketsService {
    constructor(
        private logger: LoggerService,
        private getTicketService: GetTicketService,
        private editTicketService: EditTicketService,
        private getAppealService: GetAppealService,
        private editAppealService: EditAppealService,
    ) {}

    async deleteTicketAndAppeal(roadProtectZaId: number) {
        const fnc = this.updateTicket.name;
        this.logger.debug(
            LogChannel.TICKET,
            `Deleting local ticket and appeal for roadProtectZaId: [${roadProtectZaId}]`,
            fnc,
        );
        await this.editTicketService.deleteLocalTicket(roadProtectZaId);
        await this.editAppealService.deleteLocalAppeal(roadProtectZaId);
    }

    async updateTicket(updateTicketRequest: Partial<UpdateTicketRequest>) {
        const fnc = this.updateTicket.name;
        this.logger.debug(LogChannel.TICKET, `Updating local tickets`, fnc);

        if (!updateTicketRequest.citationNo || !updateTicketRequest.id) {
            this.logger.debug(LogChannel.TICKET, `No citation number or customerId given`, fnc, updateTicketRequest);
            throw new InternalServerErrorException('No citation number or customerId given');
        }

        // Check Appeal exists
        const localAppeals = await this.getAppealService.getAllByRoadProtectId(+updateTicketRequest.id);
        // Appeal does not exist, therefore create local copy and new ticket
        if (!localAppeals || localAppeals.length < 1) {
            const appealLength = localAppeals ? localAppeals.length : 345;
            const localAppeal = await this.editAppealService.createAppealFromUpdateTicketRequest(updateTicketRequest);
            if (localAppeal) {
                // Creating ticket
                return await this.editTicketService.createTicketFromUpdateTicketRequest(
                    updateTicketRequest,
                    localAppeal,
                );
            }
            this.logger.debug(LogChannel.APPEAL, `Could not create a local appeal or ticket`, fnc);
            throw new InternalServerErrorException('Failed to create appeal.');
        }

        let localAppeal = localAppeals[0];

        // Check if appeal is edited
        if (updateTicketRequest.questionsAndAnswers) {
            this.logger.debug(LogChannel.APPEAL, `Update has an appeal`, fnc);
            localAppeal = await this.editAppealService.editLocalAppealDetails(localAppeal, updateTicketRequest);
        }

        this.logger.debug(LogChannel.TICKET, `Checking local ticket`, fnc);

        // Check if ticket already exists locally: using Road Protect ID in case citation number updated
        const localTicket = await this.getTicketService.getByRoadProtectId(+updateTicketRequest.id);

        // Ticket does not exist, therefore create local copy
        if (!localTicket) {
            this.logger.debug(LogChannel.TICKET, `Creating a local ticket`, fnc);
            return await this.editTicketService.createTicketFromUpdateTicketRequest(updateTicketRequest, localAppeal);
        }
        this.logger.debug(LogChannel.TICKET, `Editing a local ticket`, fnc);
        return await this.editTicketService.editLocalTicket(localTicket, updateTicketRequest);
    }
}
