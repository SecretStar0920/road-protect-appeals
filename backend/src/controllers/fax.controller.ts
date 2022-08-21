import { MyController } from '../helpers/decorators';
import { Post, Body, Get, Param } from '@nestjs/common';
import { FaxService } from '../services/fax.service';
import { SendFaxRequestDTO } from '../dto/send-fax-request.dto';
import { ApiImplicitHeaders } from '@nestjs/swagger';

@MyController('fax', 'Fax')
export default class FaxController {
    constructor(private readonly faxService: FaxService) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Post('send')
    public async send(@Body() body: SendFaxRequestDTO) {
        return this.faxService.send(body);
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('status/:faxCode')
    public async status(@Param('faxCode') faxCode: string) {
        return this.faxService.checkStatus(faxCode);
    }
}
