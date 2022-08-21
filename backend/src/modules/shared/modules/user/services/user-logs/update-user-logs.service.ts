import { LoggerService } from '@logger';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogChannel } from '../../../../../../config/logs';
import { User } from '@database/entities/user.entity';
import { GetUserActionService } from '../user-actions/get-user-action.service';
import { UserActionsIds } from '../user-actions/user-actions-ids';
import { UserLog } from '@database/entities/user-log.entity';
import { GetUserService } from '../get-user/get-user.service';
import { GetTicketService } from '../../../tickets/ticket/services/get-ticket.service';
import { GetAppealService } from '../../../tickets/appeal/services/get-appeal.service';
import { EditApealDto } from '../../../tickets/appeal/dtos/edit-apeal.dto';
import { Ticket } from '@database/entities/ticket.entity';

@Injectable()
export class UpdateUserLogsService {
    constructor(
        private logger: LoggerService,
        private getUserService: GetUserService,
        private getTicketService: GetTicketService,
        private getAppealService: GetAppealService,
        private getUserActionService: GetUserActionService,
    ) {}

    async newUserLog(user: User, description: string, details?: any) {
        const func = this.newUserLog.name;
        try {
            const localUserAction = await this.getUserActionService.getByDescription(description);
            if (!localUserAction) {
                this.logger.error(
                    LogChannel.USER_LOG,
                    `Failed to create user log for user [${user.userId}], invalid description`,
                    func,
                    description,
                );
                throw new InternalServerErrorException(`Failed to create user log, invalid description`);
            }
            const userLog = {
                user,
                action: localUserAction,
                details: details ? details : null,
            };
            const newUserLog = UserLog.create(userLog);
            return await newUserLog.save();
        } catch (e) {
            this.logger.error(
                LogChannel.USER_LOG,
                `Failed to create user log for user [${user.userId}]: ${description}`,
                func,
                e,
            );
            throw new InternalServerErrorException(`Failed to create user log: ${description}`);
        }
    }

    async createUserLogFromCustomerId(customerId: number, description: string, details?: any) {
        const func = this.createUserLogFromCustomerId.name;
        this.logger.debug(
            LogChannel.USER_LOG,
            `Creating user log for customerId [${customerId}]: ${description}`,
            func,
        );
        const user = await this.getUserService.getByCustomerId(customerId);
        if (user) {
            await this.newUserLog(user, description, details);
        } else {
            this.logger.error(LogChannel.USER_LOG, `Unknown customerId [${customerId}]`, func);
        }
    }

    async createUserLogFromUser(user: User, description: string, error?: any) {
        const func = this.createUserLogFromUser.name;
        this.logger.debug(LogChannel.USER_LOG, `Creating user log for userId [${user.userId}]: ${description}`, func);
        await this.newUserLog(user, description, error);
    }

    async successfulLogin(user: User) {
        await this.createUserLogFromUser(user, UserActionsIds.LOGIN.SUCCESS.description);
    }

    async failedLogin(mobile: string, error: any) {
        const func = this.failedLogin.name;
        this.logger.debug(LogChannel.USER_LOG, `Creating user log for user failed login`, func);
        const user = await this.getUserService.getByMobile(mobile);
        if (user) {
            await this.createUserLogFromUser(user, UserActionsIds.LOGIN.FAIL.description, error);
        } else {
            this.logger.debug(LogChannel.USER_LOG, `Unknown user tried to login`, func);
        }
    }

    async addTicketSuccess(user: User, details: any) {
        await this.createUserLogFromUser(user, UserActionsIds.TICKET.CREATE.SUCCESS.description, details);
    }

    async addTicketFail(user: User, error: any) {
        await this.createUserLogFromUser(user, UserActionsIds.TICKET.CREATE.FAIL.description, error);
    }

    async createAppealSuccess(customerId: number, details: any) {
        await this.createUserLogFromCustomerId(customerId, UserActionsIds.APPEAL.CREATE.SUCCESS.description, details);
    }

    async createAppealFail(customerId: number, error: any) {
        await this.createUserLogFromCustomerId(customerId, UserActionsIds.APPEAL.CREATE.FAIL.description, error);
    }

    async editTicketSuccess(ticket: Ticket) {
        const fnc = this.editTicketSuccess.name;
        const user = await this.getUserService.getUserFromTicket(ticket.ticketId);
        if (!user) {
            this.logger.error(LogChannel.USER_LOG, `No user found for given user ticketId [${ticket.ticketId}]`, fnc);
            throw new BadRequestException('No user found');
        }
        if (ticket.deletedAt) {
            await this.newUserLog(user, UserActionsIds.TICKET.DELETE.SUCCESS.description, ticket);
        } else {
            await this.newUserLog(user, UserActionsIds.TICKET.EDIT.SUCCESS.description, ticket);
        }
    }

    async editTicketFail(ticket: Ticket, error: any) {
        const fnc = this.editTicketSuccess.name;
        const user = await this.getUserService.getUserFromTicket(ticket.ticketId);
        if (!user) {
            this.logger.error(LogChannel.USER_LOG, `No user found for given user ticketId [${ticket.ticketId}]`, fnc);
            throw new BadRequestException('No user found');
        }
        if (ticket.deletedAt) {
            await this.newUserLog(user, UserActionsIds.TICKET.DELETE.FAIL.description, error);
        } else {
            await this.newUserLog(user, UserActionsIds.TICKET.EDIT.FAIL.description, error);
        }
    }

    async editAppealSuccess(roadProtectZAId: number, dto: EditApealDto) {
        const fnc = this.editAppealSuccess.name;
        const user = await this.getUserService.getUserFromRoadProtectZAId(roadProtectZAId);
        if (!user) {
            this.logger.error(
                LogChannel.USER_LOG,
                `No user found for given user roadProtectZAId [${roadProtectZAId}]`,
                fnc,
            );
            throw new BadRequestException('No user found');
        }
        if (dto.deletedAt) {
            await this.newUserLog(user, UserActionsIds.APPEAL.DELETE.SUCCESS.description, dto);
        } else {
            await this.newUserLog(user, UserActionsIds.APPEAL.EDIT.SUCCESS.description, dto);
        }
    }

    async editAppealFail(roadProtectZAId: number, dto: EditApealDto, error: any) {
        const fnc = this.editAppealFail.name;
        const user = await this.getUserService.getUserFromRoadProtectZAId(roadProtectZAId);
        if (!user) {
            this.logger.error(
                LogChannel.USER_LOG,
                `No user found for given user roadProtectZAId [${roadProtectZAId}]`,
                fnc,
            );
            throw new BadRequestException('No user found');
        }
        if (dto.deletedAt) {
            await this.newUserLog(user, UserActionsIds.APPEAL.DELETE.FAIL.description, dto);
        } else {
            await this.newUserLog(user, UserActionsIds.APPEAL.EDIT.FAIL.description, error);
        }
    }

    async couponPaymentSuccess(roadProtectZAId: number, details: any) {
        const fnc = this.couponPaymentSuccess.name;
        const user = await this.getUserService.getUserFromRoadProtectZAId(roadProtectZAId);
        if (!user) {
            this.logger.error(
                LogChannel.USER_LOG,
                `No user found for given user roadProtectZAId [${roadProtectZAId}]`,
                fnc,
            );
            throw new BadRequestException('No user found');
        }
        await this.newUserLog(user, UserActionsIds.PAY.COUPON.SUCCESS.description, details);
    }

    async couponPaymentFail(roadProtectZAId: number, error: any) {
        const fnc = this.couponPaymentFail.name;
        const user = await this.getUserService.getUserFromRoadProtectZAId(roadProtectZAId);
        if (!user) {
            this.logger.error(
                LogChannel.USER_LOG,
                `No user found for given user roadProtectZAId [${roadProtectZAId}]`,
                fnc,
            );
            throw new BadRequestException('No user found');
        }
        await this.newUserLog(user, UserActionsIds.PAY.COUPON.FAIL.description, error);
    }

    async creditCardPaymentSuccess(roadProtectZAId: number, details: any) {
        const fnc = this.creditCardPaymentSuccess.name;
        const user = await this.getUserService.getUserFromRoadProtectZAId(roadProtectZAId);
        if (!user) {
            this.logger.error(
                LogChannel.USER_LOG,
                `No user found for given user roadProtectZAId [${roadProtectZAId}]`,
                fnc,
            );
            throw new BadRequestException('No user found');
        }
        await this.newUserLog(user, UserActionsIds.PAY.CREDIT_CARD.SUCCESS.description, details);
    }

    async creditCardPaymentFail(roadProtectZAId: number, error: any) {
        const fnc = this.creditCardPaymentFail.name;
        const user = await this.getUserService.getUserFromRoadProtectZAId(roadProtectZAId);
        if (!user) {
            this.logger.error(
                LogChannel.USER_LOG,
                `No user found for given user roadProtectZAId [${roadProtectZAId}]`,
                fnc,
            );
            throw new BadRequestException('No user found');
        }
        await this.newUserLog(user, UserActionsIds.PAY.CREDIT_CARD.FAIL.description, error);
    }
}
