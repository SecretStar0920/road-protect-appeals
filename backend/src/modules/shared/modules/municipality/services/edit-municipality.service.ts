import { LoggerService } from '@logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMunicipalityDto } from '../dtos/create-municipality.dto';
import { Municipality } from '@database/entities/municipality.entity';
import { LogChannel } from '../../../../../config/logs';

@Injectable()
export class EditMunicipalityService {
    constructor(private logger: LoggerService) {}

    async create(dto: CreateMunicipalityDto): Promise<Municipality> {
        const fnc = this.create.name;
        this.logger.debug(LogChannel.MUNICIPALITY, `Creating local municipality`, fnc, dto);
        const municipality = Municipality.create(dto);

        try {
            await municipality.save();
            this.logger.debug(LogChannel.MUNICIPALITY, `Successfully created local municipality`, fnc);
            return municipality;
        } catch (e) {
            this.logger.error(LogChannel.TICKET, `Failed to create local municipality: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            throw new InternalServerErrorException('Failed to create local municipality.');
        }
    }
}
