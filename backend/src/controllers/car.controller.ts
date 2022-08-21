import { Get, Param } from '@nestjs/common';
import { ApiImplicitHeaders } from '@nestjs/swagger';
import { MyController } from '../helpers/decorators';
import { CarService } from '../services/car.service';

@MyController('cars', 'Cars')
export default class CarController {
    constructor(private carService: CarService) {}

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/')
    public async getManufacturers() {
        return (await this.carService.getManufacturers()).sort();
    }

    @ApiImplicitHeaders([{ name: 'X-Auth-Token', required: true }])
    @Get('/:manufacturer')
    public async getModels(@Param('manufacturer') manufacturer: string) {
        return this.carService.getModels(manufacturer);
    }
}
