import { Injectable } from '@nestjs/common';
import { BaseSeederService } from './base-seeder.service';
import { ZaService } from '../../../services/za/za.service';
import { LogChannel } from '../../../config/logs';
import groupBy from '../../../helpers/group-by';
import { CsvDataModel } from '../../../models/csv-data.model';
import csvHelper from '../../../helpers/csv.helper';
import { resolve } from 'path';
import { Municipality } from '@database/entities/municipality.entity';
import { CourthouseModel } from '../../../models/courthouse.model';

@Injectable()
export class MunicipalitySeederService extends BaseSeederService {
    protected seederName: string = 'Municipality';
    private readonly citiesAndStreetCSV: CsvDataModel[];

    constructor(private readonly zaService: ZaService) {
        super();
        this.citiesAndStreetCSV = csvHelper(resolve(__dirname + '../../../../data/cities.csv'));
    }

    async seedData() {
        // Get courthouses
        const courtHouses = await this.zaService.getCourtHouses();
        if (courtHouses instanceof Error) {
            this.logger.error(
                LogChannel.CLI,
                `Failed to create find any courthouses: ${courtHouses.message}`,
                this.seederName,
                courtHouses,
            );
            return;
        }
        this.logger.info(LogChannel.CLI, `Found ${courtHouses.length} Courthouses from infrasonic`, this.seederName);

        // Get and sort cities and codes from the CSV file
        const data = this.citiesAndStreetCSV;
        const group = groupBy(data, 'סמל_ישוב', 'שם_ישוב');
        const cityCodes = Object.keys(group);
        const cityNames = Object.values(group).flat();
        this.logger.info(LogChannel.CLI, `Found ${cityCodes.length} Municipalities from the CSV file`, this.seederName);

        // Save each municipality from csv
        for (let i = 0; i < Object.keys(group).length; i++) {
            const municipality = {
                cityCode: cityCodes[i].trim(),
                cityName: String(cityNames[i]),
                courthouseRP: this.findAndRemoveByCode(courtHouses, String(cityCodes[i]).trim()),
            };
            const newMunicipality = Municipality.create(municipality);
            try {
                await newMunicipality.save();
            } catch (e) {
                this.logger.error(
                    LogChannel.CLI,
                    `Failed to create Municipality: ${e.message}`,
                    this.seederName,
                    newMunicipality,
                );
            }
        }
        this.logger.info(LogChannel.CLI, `Saved all municipalities from CSV file`, this.seederName);

        // Save each municipality from leftover courthouses
        this.logger.info(
            LogChannel.CLI,
            `Seeding remaining courthouses retrieved from Infrasonic. ${courtHouses.length} courthouses found.`,
            this.seederName,
        );
        for (const courtHouse of courtHouses) {
            const municipality = {
                cityCode: courtHouse.Code,
                cityName: courtHouse.City,
                courthouseRP: courtHouse,
            };
            const newMunicipality = Municipality.create(municipality);
            try {
                await newMunicipality.save();
            } catch (e) {
                this.logger.error(
                    LogChannel.CLI,
                    `Failed to create Municipality: ${e.message}`,
                    this.seederName,
                    newMunicipality,
                );
            }
        }
    }

    findAndRemoveByCode(courtHouses: CourthouseModel[], code: string) {
        const index = courtHouses.findIndex(o => o.Code === code);
        if (index < 0) {
            this.logger.error(LogChannel.CLI, `No Infrasonic courthouse for code: ${code}`, this.seederName);
            return {};
        }
        return courtHouses.splice(index, 1)[0];
    }
}
