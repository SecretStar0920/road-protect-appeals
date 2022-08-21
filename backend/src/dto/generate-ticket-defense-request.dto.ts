import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateTicketDefenseRequestDTO {
    @ApiModelProperty()
    @IsString()
    public customParagraphs: string;
}
