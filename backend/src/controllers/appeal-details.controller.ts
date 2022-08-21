import { Controller, Get, Req } from '@nestjs/common';
import { AppealDetailsRequestsService } from '../services/requests/appeal-details-requests.service';
import { ApiImplicitHeaders } from '@nestjs/swagger';
import { Request } from 'express';
import { IViolations } from '../models/violations.model';

@Controller('appeal-details')
export class AppealDetailsController {
    constructor(private readonly appealDetailsRequestService: AppealDetailsRequestsService) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/violations')
    public async getViolations(@Req() request: Request): Promise<IViolations[]> {
        const headers = {
            'X-Auth-Token': request.headers['x-auth-token'],
        };
        return this.appealDetailsRequestService.getViolations(headers);
    }
}
