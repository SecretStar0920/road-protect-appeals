import { Injectable } from '@nestjs/common';
import { BaseSeederService } from './base-seeder.service';
import { VehicleMake } from '@database/entities/vehicle-make.entity';
import { LogChannel } from '../../../config/logs';
import { VehicleModel } from '@database/entities/vehicle-model.entity';
import { RedisService } from '../../../services/redis.service';
import { ResourcesLoader } from '../../../services/resources.loader';
import { CarService } from '../../../services/car.service';

@Injectable()
export class VehicleSeederService extends BaseSeederService {
    protected seederName: string = 'Vehicles';

    constructor(
        private readonly redisService: RedisService,
        private readonly resourcesLoader: ResourcesLoader,
        private readonly carService: CarService,
    ) {
        super();
    }

    async seedData() {
        const manufacturerList = await this.redisService.getKeyWithFallback(
            'manufacturers',
            async () => await this.resourcesLoader.loadCarsData('manufacturers'),
        );
        const makeNumbers = Object.keys(manufacturerList).filter(key => manufacturerList.hasOwnProperty(key));
        for (const makeNo of makeNumbers) {
            const carMake = {
                vehicleMake: String(manufacturerList[makeNo]),
                vehicleModels: [],
            };
            this.logger.debug(
                LogChannel.CLI,
                `[${this.seederName}] - saving make: [${carMake.vehicleMake}] information`,
                this.seedData.name,
            );
            const newMake = VehicleMake.create(carMake);
            try {
                await newMake.save();
            } catch (e) {
                this.logger.error(
                    LogChannel.CLI,
                    `Failed to create VehicleMake: ${e.message}`,
                    this.seederName,
                    carMake,
                );
            }
            const models = await this.carService.getModels(carMake.vehicleMake);
            for (const model of models) {
                const carModel = {
                    vehicleModel: String(model),
                    vehicleMake: newMake,
                    vehicles: [],
                };
                const newModel = VehicleModel.create(carModel);
                try {
                    await newModel.save();
                } catch (e) {
                    this.logger.error(
                        LogChannel.CLI,
                        `Failed to create VehicleModel: ${e.message}`,
                        this.seederName,
                        carModel,
                    );
                }
            }
        }
    }
}
