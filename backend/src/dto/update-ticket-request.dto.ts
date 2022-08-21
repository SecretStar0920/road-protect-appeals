import { UpdateTicketRequest } from '../apis/ZA/api';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, IsArray, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateTicketRequestDTO extends UpdateTicketRequest {
    @ApiModelProperty()
    @IsString()
    public ticketType: string;

    @ApiModelProperty()
    @IsNumber()
    public ticketStatus: number;

    @ApiModelProperty()
    @IsString()
    public citationNo: string;

    @ApiModelProperty()
    @IsNumberString()
    public licensePlate: string;

    @ApiModelProperty()
    @IsString()
    public violationDate: string;

    @ApiModelProperty()
    @IsString()
    public violationTime: string;

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    public violationCodes: string;

    @ApiModelProperty()
    @IsNumberString()
    @IsOptional()
    public institutionId: string;

    @ApiModelProperty()
    @IsOptional()
    @IsString()
    public modelCode: string;

    @ApiModelProperty()
    @IsOptional()
    @IsString()
    public modelType: string;

    @ApiModelProperty()
    @IsOptional()
    @IsString()
    public makeCode: string;

    @ApiModelProperty()
    @IsString()
    public vehicleMake: string;

    @ApiModelProperty()
    @IsNumberString()
    @IsOptional()
    public vehicleYear: string;

    @ApiModelProperty()
    @IsString()
    public violationCity: string;

    @ApiModelProperty()
    @IsString()
    public violationAddress: string;

    @ApiModelProperty()
    @IsOptional()
    public violationHouseNumber: string;

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    public city: string;

    @ApiModelProperty()
    @IsString()
    @IsOptional()
    public address: string;

    @ApiModelProperty()
    @IsOptional()
    public houseNumber: string;

    @ApiModelProperty()
    @IsNumberString()
    @IsOptional()
    public violationId: string;

    @ApiModelProperty()
    @IsNumberString()
    public customerId: string;

    @ApiModelProperty()
    @IsNumber()
    public transactionState: number;

    @ApiModelProperty()
    @IsNumberString()
    public amount: string;

    @ApiModelProperty()
    @IsNumber()
    public id: string;

    @ApiModelProperty()
    @IsBoolean()
    public hasMembership: boolean;

    @ApiModelProperty()
    @IsString()
    public paymentRefNumber: string;

    @ApiModelProperty()
    @IsArray()
    public questionsAndAnswers: string[][];
}
