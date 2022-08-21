import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { CustomerModel } from '../models/customer.model';
import { GenerateTicketDefenseRequestDTO } from './generate-ticket-defense-request.dto';
import { GetTicketResponseDTO } from './get-ticket-response.dto';

export class SubmitAppealRequestDTO extends GenerateTicketDefenseRequestDTO {
    @ApiModelProperty()
    @IsDefined()
    public ticket: GetTicketResponseDTO;

    @ApiModelProperty()
    @IsDefined()
    public user: CustomerModel;
}
