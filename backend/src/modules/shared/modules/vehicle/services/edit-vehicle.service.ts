import { LoggerService } from '@logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LogChannel } from '../../../../../config/logs';
import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { Vehicle } from '@database/entities/vehicle.entity';
import { GetVehicleService } from './get-vehicle.service';

@Injectable()
export class EditVehicleService {
    constructor(private logger: LoggerService, private getVehicleService: GetVehicleService) {}

    private async create(dto: CreateVehicleDto): Promise<Vehicle> {
        const fnc = this.create.name;
        this.logger.debug(LogChannel.VEHICLE, `Creating local vehicle`, fnc, dto);
        const vehicle = Vehicle.create(dto);

        try {
            await vehicle.save();
            return vehicle;
        } catch (e) {
            this.logger.debug(LogChannel.VEHICLE, `Failed to create vehicle: ${e.message}`, fnc, {
                dto,
                stack: e.stack,
            });
            throw new InternalServerErrorException('Failed to create vehicle.');
        }
    }

    private async createVehicle(
        vehicleRegistration: string,
        vehicleModelName: string,
        vehicleMakeName: string,
    ): Promise<Vehicle> {
        const fnc = this.createVehicle.name;
        this.logger.debug(LogChannel.VEHICLE, `Creating local vehicle [${vehicleRegistration}]`, fnc);

        const vehicleModel = await this.getVehicleService.getVehicleModel(vehicleModelName, vehicleMakeName);
        if (!vehicleModel) {
            this.logger.debug(
                LogChannel.VEHICLE,
                `Could not create vehicle [${vehicleRegistration}], model not found`,
                fnc,
                {
                    vehicleModelName,
                    vehicleMakeName,
                    vehicleModel,
                },
            );
            throw new InternalServerErrorException('Failed to create vehicle - model does not exist.');
        }

        const vehicle: CreateVehicleDto = {
            vehicleRegistration,
            vehicleModel,
        };
        return await this.create(vehicle);
    }

    async updateVehicle(
        vehicleRegistration: string,
        vehicleModelName: string,
        vehicleMakeName: string,
    ): Promise<Vehicle> {
        const fnc = this.updateVehicle.name;
        this.logger.debug(LogChannel.VEHICLE, `Updating local vehicles: [${vehicleRegistration}]`, fnc);

        const localVehicle = await this.getVehicleService.getVehicleByRegistration(vehicleRegistration);

        if (!localVehicle) {
            this.logger.debug(LogChannel.VEHICLE, `No local vehicles: [${vehicleRegistration}], creating one.`, fnc);
            return this.createVehicle(vehicleRegistration, vehicleModelName, vehicleMakeName);
        }

        const vehicleModel = await this.getVehicleService.getVehicleModel(vehicleModelName, vehicleMakeName);
        if (!vehicleModel) {
            this.logger.debug(LogChannel.VEHICLE, `Vehicle model not found`, fnc, {
                vehicleModelName,
                vehicleMakeName,
                vehicleModel,
            });
            throw new InternalServerErrorException('Failed to create vehicle - model does not exist.');
        }
        localVehicle.vehicleModel = vehicleModel;
        try {
            await localVehicle.save();
            return localVehicle;
        } catch (e) {
            this.logger.debug(LogChannel.VEHICLE, `Failed to edit vehicle: ${e.message}`, fnc, {
                localVehicle,
                stack: e.stack,
            });
            throw new InternalServerErrorException('Failed to edit vehicle.');
        }
    }
}
