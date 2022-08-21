import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { MiscApi } from '../../apis/ZA/api/misc-api';
import got from 'got';
import config from '@config';
import { Request } from 'express';
import { logZARequests } from '../../helpers/decorators';
import { LogChannel } from '../../config/logs';
import { IViolations } from '../../models/violations.model';

@Injectable()
export class AppealDetailsRequestsService {
    private readonly _zaApi: MiscApi;
    constructor(private logger: LoggerService) {
        this._zaApi = new MiscApi(config.za.host);
    }

    @logZARequests
    async getViolations(headers: any = {}): Promise<IViolations[]> {
        const fnc = this.getViolations.name;
        const url = this._zaApi.basePath + '/OldViolation/getViolations';
        let options: any = {};
        options.headers = headers;

        this.logger.debug(LogChannel.ZA, `Retrieving list of violations`, fnc, url);
        try {
            const result: { success: boolean; status: number; data: IViolations[] } = await got
                .get(url, options)
                .json();

            this.logger.debug(LogChannel.ZA, `Received list of violations`, fnc, result.data);

            // TODO: Remove once legacy data is no longer submitted
            return result.data.filter(item => {
                return typeof item.genericProperty !== 'number';
            });
        } catch (exception) {
            this.logger.error(LogChannel.ZA, `Failed to get violations`, fnc, {
                body: exception.body ? exception.body.error : exception,
                stack: exception.stack,
            });
            throw new Error(exception.body ? exception.body : exception);
        }
    }
}
