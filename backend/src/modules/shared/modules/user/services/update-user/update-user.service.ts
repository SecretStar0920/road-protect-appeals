import { User } from '@database/entities/user.entity';
import { LoggerService } from '@logger';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { merge } from 'lodash';
import { UpdateCustomerProfileRequest } from '../../../../../../apis/ZA/model/update-customer-profile-request';
import { LogChannel } from '../../../../../../config/logs';
import { UpdateCustomerProfileRequestDTO } from '../../../../../../dto/update-customer-profile-request.dto';
import { ZaService } from '../../../../../../services/za/za.service';
import { UpdateUserDto } from '../../dtos/update-user.dto';

@Injectable()
export class UpdateUserService {
    constructor(private logger: LoggerService, private zaService: ZaService) {}

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        const fnc = this.update.name;
        this.logger.debug(LogChannel.USER, `Updating local user with id ${id}`, fnc, dto);

        let user = await User.findOne(id);

        if (!user) {
            this.logger.error(LogChannel.USER, `No user found with id ${id}`, fnc, dto);
            throw new NotFoundException(`No user found`);
        }

        try {
            user = merge(user, dto);
            await user.save();
            return user;
        } catch (e) {
            this.logger.error(LogChannel.USER, `Failed to update user: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            throw new InternalServerErrorException('Failed to update user.');
        }
    }

    async updateWithRpZa(roadProtectZaId: number, dto: UpdateCustomerProfileRequestDTO, request: Request) {
        const fnc = this.updateWithRpZa.name;
        this.logger.debug(LogChannel.USER, `Updating user on RP ZA`, fnc, dto);
        let user = await User.createQueryBuilder('user')
            .andWhere('user.roadProtectZAId = :id', { id: roadProtectZaId })
            .getOne();

        if (!user) {
            this.logger.error(LogChannel.USER, `No user found with road protect id ${roadProtectZaId}`, fnc, dto);
            throw new NotFoundException(`No user found`);
        }

        try {
            user = merge(user, dto);
            user.details.additionalMobileNumber = dto.additionalMobileNumber;
            await user.save();
            const rpZaRequest: UpdateCustomerProfileRequest = {
                ...dto,
                mobileNumber: user.mobileNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                customerId: `${roadProtectZaId}`,
            };
            return await this.zaService.updateCustomerProfile(roadProtectZaId, rpZaRequest, request);
        } catch (e) {
            this.logger.error(LogChannel.USER, `Failed to update user: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            throw new InternalServerErrorException('Failed to update user.');
        }
    }
}
