import { TicketService } from '../../../core/services/ticket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';
import { ImgPathService } from '../../../core/services/img-path.service';
import { MatDialog } from '@angular/material/dialog';
import { WarningModalComponent } from './warning-modal/warning-modal.component';
import { CrudService } from 'src/app/core/services/crud.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-fine-details',
    templateUrl: './fine-details.component.html',
    styleUrls: ['./fine-details.component.scss'],
})
export class FineDetailsComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<any>();
    private cities: { id: number; name: string }[] = [];
    private streets: string[] = [];
    public vehicleManufactures: string[] = [];
    public vehicleModels: string[] = [];

    public filteredCities: Observable<any[]>;
    public filteredStreets: Observable<any[]>;

    public vehicleTypeFilteredArray: any[];
    public maxDate: Date = new Date();

    constructor(
        private crudService: CrudService,
        public imgPathService: ImgPathService,
        public ticketService: TicketService,
        private dialog: MatDialog,
        private router: Router,
    ) {}

    async ngOnInit() {
        await this.getCities();
        await this.getVehicleManufactures();
        this.initListeners();
        if (this.formGroup.get('vehicleMake').value !== '') {
            this.getModelsByManufacture();
        }
        if (this.formGroup.get('city').value !== '') {
            this.getStreets();
        }
    }

    private async getCities() {
        this.cities = (await this.crudService.getCourtHouses()).map(c => ({ id: +c.id, name: c.City }));
    }

    private async getVehicleManufactures() {
        this.vehicleManufactures = await this.crudService.getVehicleManufactures();
    }

    public async getModelsByManufacture() {
        const manufacture = this.formGroup.get('vehicleMake').value;
        if (!manufacture || manufacture === '') {
            return;
        }
        this.vehicleModels = await this.crudService.getVehicleModel(manufacture);
    }

    public async getStreets() {
        this.formGroup.get('violationAddress').enable();
        const city = this.formGroup.get('violationCity').value;
        const index = this.cities.findIndex(cityModel => cityModel.name === city);
        if (!city || city === '' || index === -1) {
            return;
        }
        this.streets = await this.crudService.getStreets(city);
    }

    public get formGroup() {
        return this.ticketService.fine;
    }

    private initListeners() {
        const carType = this.formGroup.get('modelType').value;
        if (carType && carType.length > 0) {
            this.handleVehicleModel(carType);
        }

        this.formGroup
            .get('vehicleMake')
            .valueChanges.pipe(takeUntil(this.destroy$))
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe(carType => {
                if (carType) {
                    this.handleVehicleModel(carType);
                }
            });

        this.formGroup
            .get('violationCity')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(val => {
                if (val) {
                    this.formGroup.get('violationAddress').enable();
                    this.formGroup.get('violationAddress').setValidators([Validators.required]);
                }
            });

        this.formGroup
            .get('violationDate')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value: moment.Moment) => {
                if (moment(new Date()).diff(value, 'days') > 29) {
                    this.dialog.open(WarningModalComponent);
                }
            });
        this.filterCitiesFunc();
        this.filterStreetsFunc();
    }

    private handleVehicleModel(carType) {
        this.vehicleTypeFilteredArray = this.vehicleManufactures.filter(manufacture => manufacture === carType);
        this.formGroup.get('modelType').enable();
    }

    public async onSubmit() {
        const ticket = await this.crudService.updateTicket();
        this.ticketService.fine.patchValue({
            courthouse: ticket.courthouse,
        });
        this.ticketService.fine.get('finished').patchValue(true);
        if (!this.ticketService.routeToEnd()) {
            return this.router.navigate(['/appeal', 'details']);
        }
        return this.router.navigate(['/appeal', 'summary']);
    }

    private _citiesFilter(name: string): any[] {
        const citiesWithNameAtStart = this.cities.filter(city => city && city.name.indexOf(name) === 0);
        const otherFilteredCities = this.cities.filter(city => city && city.name.indexOf(name) > 0);
        return [...citiesWithNameAtStart, ...otherFilteredCities];
    }

    private _streetFilter(name: string): any[] {
        const streetsWithNameAtStart = this.streets.filter(street => street && street.indexOf(name) === 0);
        const otherFilteredStreets = this.streets.filter(street => street && street.indexOf(name) > 0);
        return [...streetsWithNameAtStart, ...otherFilteredStreets];
    }

    public displayCityFn(city?: string): string | undefined {
        return city ? city : undefined;
    }

    public displayStreetFn(street?: any): string | undefined {
        return street ? street : undefined;
    }

    private filterCitiesFunc() {
        this.filteredCities = this.formGroup.get('violationCity').valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : '')),
            map((name: string) => (name ? this._citiesFilter(name) : this.cities.slice())),
        );
    }

    private filterStreetsFunc() {
        this.filteredStreets = this.formGroup.get('violationAddress').valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : '')),
            map((name: string) => (name ? this._streetFilter(name) : this.streets.slice())),
        );
    }

    public deleteStreet() {
        this.formGroup.get('violationAddress').reset();
        this.formGroup
            .get('violationCity')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(city => {
                const isCityExists = this.cities.filter(ct => {
                    return ct === city;
                });
                if (isCityExists.length !== 1) {
                    this.formGroup.get('violationAddress').disable();
                }
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
}
