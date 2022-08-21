import { Get, Param } from '@nestjs/common';
import { ApiImplicitHeaders } from '@nestjs/swagger';
import { MyController } from '../helpers/decorators';
import { CityService } from '../services/city.service';

@MyController('cities', 'Cities')
export default class CityController {
    constructor(private readonly cityService: CityService) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/')
    public async getCities() {
        return await this.cityService.getCities();
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/:cityName')
    public async getStreetsByCityId(@Param('cityName') cityName: string) {
        return this.cityService.getStreetsByCityName(cityName);
    }
}
