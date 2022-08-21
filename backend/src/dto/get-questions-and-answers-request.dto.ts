import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetQuestionsAndAnswersRequestDTO {
    @ApiModelProperty()
    @Transform(v => Number(v))
    @IsNumber()
    public ticketId: number;
}
