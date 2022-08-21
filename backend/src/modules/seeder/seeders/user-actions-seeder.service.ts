import { Injectable } from '@nestjs/common';
import { UserActions } from '@database/entities/user-actions.entity';
import { BaseItemSeederService } from './base-item-seeder.service';
import { LogChannel } from '../../../config/logs';
import { UserActionsIds } from '../../shared/modules/user/services/user-actions/user-actions-ids';

@Injectable()
export class UserActionsSeederService extends BaseItemSeederService<UserActions> {
    protected seederName: string = 'User-Actions';

    constructor() {
        super();
    }

    async setSeedData() {
        this.data = this.flattenUserActions(UserActionsIds);
    }

    async seedItemFunction(item: Partial<UserActions>) {
        const newItem = await UserActions.create(item);
        try {
            return await newItem.save();
        } catch (e) {
            this.logger.error(LogChannel.CLI, `Failed to save User Action item: ${e.message}`, this.seederName, item);
        }
    }

    private flattenUserActions(userActions) {
        return userActions.SUCCESS || userActions.FAIL
            ? [userActions.SUCCESS, userActions.FAIL]
            : Object.keys(userActions).reduce((r, k) => {
                  return r.concat(this.flattenUserActions(userActions[k]));
              }, []);
    }
}
