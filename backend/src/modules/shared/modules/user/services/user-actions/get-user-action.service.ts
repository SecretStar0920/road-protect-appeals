import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { UserActions } from '@database/entities/user-actions.entity';
import { LogChannel } from '../../../../../../config/logs';

@Injectable()
export class GetUserActionService {
    constructor(private logger: LoggerService) {}

    async getById(userActionId: number): Promise<UserActions | undefined> {
        this.logger.debug(LogChannel.USER_ACTIONS, `Getting user action [${userActionId}]`, this.getById.name);
        try {
            return await UserActions.createQueryBuilder('actions')
                .where('actions.userActionId = :userActionId', { userActionId })
                .getOne();
        } catch (error) {
            this.logger.error(
                LogChannel.USER_ACTIONS,
                `Failed to get user action [${userActionId}]`,
                this.getById.name,
                {
                    error,
                },
            );
        }
    }

    async getByDescription(description: string): Promise<UserActions | undefined> {
        this.logger.debug(LogChannel.USER_ACTIONS, `Getting user action [${description}]`, this.getByDescription.name);
        try {
            return await UserActions.createQueryBuilder('actions')
                .where('actions.description = :description', { description })
                .getOne();
        } catch (error) {
            this.logger.error(
                LogChannel.USER_ACTIONS,
                `Failed to get user action [${description}]`,
                this.getByDescription.name,
                {
                    error,
                },
            );
            throw new Error(`Failed to get user action [${description}]`);
        }
    }
}
