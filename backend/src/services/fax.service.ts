import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import config, { getENV } from '../config';
import { LogChannel } from '../config/logs';
import { SendFaxRequestDTO } from '../dto/send-fax-request.dto';
import { parseStringPromise } from 'xml2js';
import { EnvironmentOptions } from '../helpers/environment';
import { LoggerService } from '@logger';

@Injectable()
export class FaxService {
    constructor(private logger: LoggerService) {}

    public async send(body: SendFaxRequestDTO) {
        const fnc = this.send.name;
        this.logger.debug(LogChannel.FAX, `A fax request has been made`, fnc, body);
        const { email, password } = config.fax;
        const { faxNumber, fileUrl } = body;

        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);
        params.append('faxNumber', faxNumber);
        params.append('fileURL', fileUrl);

        if (getENV() === EnvironmentOptions.production) {
            this.logger.debug(LogChannel.FAX, `Sending the fax to ${config.fax.api.send}`, fnc, {
                email,
                password,
                faxNumber,
                fileUrl,
            });
            const response = await Axios.post(config.fax.api.send, params);
            const responseData = await parseStringPromise(response.data);
            this.logger.debug(LogChannel.FAX, `Received the following response`, fnc, responseData);
        } else {
            this.logger.debug(
                LogChannel.FAX,
                `We are not in production mode so this is a mock fax to ${faxNumber} and file url ${fileUrl}`,
                fnc,
            );
        }
    }

    // Requires a job that runs in the backgound after the fax was sent to check its status.
    // Not yet implemented.
    public checkStatus(faxCode: string) {
        const { email, password } = config.fax;
        return Axios.post(config.fax.api.checkStatus, { email, password, faxCode });
    }
}
