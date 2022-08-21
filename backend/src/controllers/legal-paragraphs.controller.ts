import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiImplicitHeaders } from '@nestjs/swagger';
import { Request } from 'express';
import { ILegalParagraph } from '../models/legal-paragraph.model';
import { LegalParagraphRequestsService } from '../services/requests/legal-paragraph-requests.service';

@Controller('legal-paragraph')
export class LegalParagraphController {
    constructor(private legalParagraphRequestsService: LegalParagraphRequestsService) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/:ticketId')
    public async getTicketDefenceParagraphs(
        @Req() request: Request,
        @Param('ticketId') ticketId: number,
    ): Promise<ILegalParagraph[]> {
        const headers = {
            'X-Auth-Token': request.headers['x-auth-token'],
        };
        return this.legalParagraphRequestsService.getLegalParagraphs(ticketId, headers);
    }
}
