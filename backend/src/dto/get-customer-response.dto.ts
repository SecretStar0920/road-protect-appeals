import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean } from 'class-validator';

export class GetCustomerResponseDTO {
    @ApiModelProperty({ example: 0 })
    @IsNumber()
    public id: number;

    @ApiModelProperty({ example: 'Test' })
    @IsString()
    public firstName: string;

    @ApiModelProperty({ example: 'Test' })
    @IsString()
    public lastName: string;

    @ApiModelProperty({ example: 'test@test.com' })
    @IsString()
    public email: string;

    @ApiModelProperty({ example: '0500000000' })
    @IsString()
    public mobile: string;

    @ApiModelProperty({ example: 'street_0 (street_houseNum)' })
    @IsString()
    public address: string;

    @ApiModelProperty({ example: 'city' })
    @IsString()
    public city: string;

    @ApiModelProperty({ example: '987654324' })
    @IsString()
    public israelIdNumber: string;

    @ApiModelProperty({ example: 'IL' })
    @IsString()
    public country: string;

    @ApiModelProperty({ example: 'RoadProtectIL' })
    @IsString()
    public ticketSystemName: string = 'RoadProtectIL';

    @ApiModelProperty({ example: false })
    @IsBoolean()
    public hasMembership: boolean;
}
