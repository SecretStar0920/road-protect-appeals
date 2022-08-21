import { Injectable } from '@nestjs/common';
import { BaseSeederService } from './base-seeder.service';
import { User, UserType } from '@database/entities/user.entity';
import { PasswordService } from '../../auth/services/password.service';
import { LogChannel } from '../../../config/logs';

@Injectable()
export class UserSeederService extends BaseSeederService {
    protected seederName: string = 'User';

    constructor() {
        super();
    }

    async seedData(): Promise<any> {
        const passwordService = new PasswordService();
        const generatedPassword = await passwordService.generatePassword();
        const adminUser = new User();
        adminUser.firstName = 'Kerren';
        adminUser.lastName = 'Ortlepp';
        adminUser.mobileNumber = '+27833294926';
        adminUser.type = UserType.Admin;
        adminUser.password = generatedPassword.bcrypted;
        this.logger.info(LogChannel.CLI, `Created an admin user`, this.seedData.name, {
            adminUser,
            generatedPassword,
        });
        await adminUser.save();
    }
}
