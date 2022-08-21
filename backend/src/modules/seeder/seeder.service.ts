import { Injectable } from '@nestjs/common';
import { BaseSeederService } from './seeders/base-seeder.service';
import { VehicleSeederService } from './seeders/vehicle-seeder.service';
import { MunicipalitySeederService } from './seeders/municipality-seeder.service';
import { UserActionsSeederService } from './seeders/user-actions-seeder.service';
import { UserSeederService } from './seeders/user-seeder.service';

@Injectable()
export class SeederService {
    seeders: BaseSeederService[] = [
        this.userSeeder,
        this.vehicleSeeder,
        this.municipalitySeeder,
        this.userActionSeeder,
    ];

    constructor(
        private readonly vehicleSeeder: VehicleSeederService,
        private readonly municipalitySeeder: MunicipalitySeederService,
        private readonly userActionSeeder: UserActionsSeederService,
        private readonly userSeeder: UserSeederService,
    ) {}

    async seed() {
        for (const seeder of this.seeders) {
            await seeder.run();
        }
    }
}
