import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { LogChannel } from '../config/logs';
import csvHelper from '../helpers/csv.helper';
import groupBy from '../helpers/group-by';
import { CsvDataModel } from '../models/csv-data.model';
import { RedisService } from './redis.service';
import { LoggerService } from '@logger';

@Injectable()
export class ResourcesLoader {
    private citiesAndStreetCSV: CsvDataModel[];
    private carsAndModelsCSV: CsvDataModel[];

    constructor(private readonly redisService: RedisService, private readonly logger: LoggerService) {
        this.citiesAndStreetCSV = csvHelper(resolve(__dirname + '/../data/cities.csv'));
        this.carsAndModelsCSV = csvHelper(resolve(__dirname + '/../data/cars.csv'), '|');
        this.loadDependencies();
    }

    private async loadDependencies() {
        const fnc = this.loadDependencies.name;
        const citiesAndStreetsLoaded = await this.redisService.getKey('citiesAndStreetsLoaded');
        const carsAndModelsLoaded = await this.redisService.getKey('carsAndModelsLoaded');
        if (citiesAndStreetsLoaded !== 'true') {
            this.logger.info(LogChannel.RESOURCES, '[Resource Loader]:: Loading cities and streets dependencies', fnc);
            await this.loadCitiesAndStreets();
            this.logger.info(LogChannel.RESOURCES, '[Resource Loader]:: Cities and streets loaded successfully', fnc);
        } else {
            this.logger.info(LogChannel.RESOURCES, '[Resource Loader]:: Cities and streets loaded successfully', fnc);
        }
        if (carsAndModelsLoaded !== 'true') {
            this.logger.info(LogChannel.RESOURCES, '[Resource Loader]:: Loading cars and models dependencies', fnc);
            await this.loadCarsData();
            this.logger.info(LogChannel.RESOURCES, '[Resource Loader]:: Cars and models loaded successfully', fnc);
        } else {
            this.logger.info(LogChannel.RESOURCES, '[Resource Loader]:: Cars and models loaded successfully', fnc);
        }
    }

    public async loadCitiesAndStreets(returnVal = 'cities') {
        let res;
        const data = this.citiesAndStreetCSV;
        const group = groupBy(data, 'שם_ישוב', 'שם_רחוב');

        const cities = Object.keys(group);
        for (const city of cities) {
            const streets = group[city];
            const key = `${city.trim()}_streets`;
            await this.redisService.setKey(key, streets);
            await this.redisService.setKey('citiesAndStreetsLoaded', 'true');
            if (returnVal === key) {
                res = streets;
            }
        }
        await this.redisService.setKey('cities', cities);
        if (returnVal === 'cities') {
            res = cities;
        }
        return res;
    }

    async loadCarsData(returnVal = 'manufacturers') {
        let res;
        const data = this.carsAndModelsCSV;
        const group = groupBy(data, 'tozar', 'kinuy_mishari_clean');

        const manufacturers = Object.keys(group);
        for (const manufacturer of manufacturers) {
            const models = group[manufacturer];
            const key = `${manufacturer}_models`;
            await this.redisService.setKey(key, models);
            await this.redisService.setKey('carsAndModelsLoaded', 'true');
            if (returnVal === key) {
                res = models;
            }
        }
        await this.redisService.setKey('manufacturers', manufacturers);
        if (returnVal === 'manufacturers') {
            res = manufacturers;
        }
        return res;
    }
}
