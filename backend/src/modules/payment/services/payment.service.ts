import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { v4 } from 'uuid';

import config from '@config';
import { LogChannel } from '../../../config/logs';
import { LoggerService } from '@logger';

@Injectable()
export class PaymentService {
    constructor(private logger: LoggerService) {}

    public async doDeal(email: string) {
        const baseUrl = `${config.app.mainUrl}/${config.app.apiPrefix}`;
        const fnc = this.doDeal.name;
        this.logger.debug(LogChannel.PAYMENT, `Creating a deal`, fnc, {
            email,
            baseUrl,
        });
        const { gatewayUrl, username, password, terminalId, mid } = config.creditGuard;
        const amountTotal = `${config.appealCost.amountInShekels}00`;

        const doDealRequest = `user=${username}&password=${password}&int_in=<ashrait>
        <request>
            <language>HEB</language>
            <command>doDeal</command>
            <version>2000</version>
            <doDeal>
                <terminalNumber>${terminalId}</terminalNumber>
                <transactionCode>Phone</transactionCode>
                <transactionType>Debit</transactionType>
                <total>${amountTotal}</total>
                <creditType>RegularCredit</creditType>
                <cardNo>CGMPI</cardNo>
                <validation>TxnSetup</validation>
                <mpiValidation>AutoComm</mpiValidation>
                <uniqueid>${v4()}</uniqueid>
                <email>${email}</email>
                <currency>ILS</currency>
                <mid>${mid}</mid>
                <successUrl>${baseUrl}/payment/success</successUrl>
                <errorUrl>${baseUrl}/payment/error</errorUrl>
            </doDeal>
        </request>
    </ashrait>`;

        this.logger.debug(LogChannel.PAYMENT, `Sending deal request to credit guard portal`, fnc, doDealRequest);

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': '*',
        };
        const xmlResponse = await Axios.post(gatewayUrl, doDealRequest, { headers });
        this.logger.debug(LogChannel.PAYMENT, `Received the following response`, fnc, xmlResponse.data);
        return xmlResponse.data;
    }
}
