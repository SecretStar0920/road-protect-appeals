import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FRONTEND_ENDPOINTS } from '../../../config/frontend-endpoints';
import { TicketService } from '../../../core/services/ticket.service';
import { CrudService } from 'src/app/core/services/crud.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit, OnDestroy {
    unsubscriber$ = new Subject<any>();
    filteredCities: Observable<any[]>;
    filteredStreets: Observable<any[]>;
    phonePrefixArray = ['050', '051', '052', '053', '054', '055', '056', '058', '059'];
    cities: string[] = [];
    streets: string[] = [];

    constructor(
        public readonly ticketService: TicketService,
        private readonly crudService: CrudService,
        private readonly router: Router,
    ) {}

    public get formGroup() {
        return this.ticketService.userInfo;
    }

    ngOnInit() {
        this.getCities();
        this.initListeners();

        if (this.ticketService.userInfo.get('city').value !== '') {
            this.ticketService.userInfo.get('address').enable();
        }

        if (this.ticketService.userInfo.get('lastName').value !== '') {
            this.ticketService.userInfo.get('lastName').disable();
        }

        if (this.ticketService.userInfo.get('firstName').value !== '') {
            this.ticketService.userInfo.get('firstName').disable();
        }

        if (this.ticketService.userInfo.get('mobile').value !== '') {
            this.ticketService.userInfo.get('mobile').disable();
            this.ticketService.userInfo.get('phone').disable();
            this.ticketService.userInfo.get('phonePrefix').disable();
        }
    }

    private async getCities() {
        this.cities = await this.crudService.getCities();
    }

    private initListeners(): void {
        this.filterCitiesFunc();
        this.filterStreetsFunc();
        this.ticketService.userInfo
            .get('city')
            .valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(val => {
                if (val) {
                    this.ticketService.userInfo.get('address').enable();
                    this.ticketService.userInfo.get('address').setValidators([Validators.required]);
                }
            });
    }

    public async onSubmit() {
        await this.crudService.updateCustomerProfile();
        this.ticketService.userInfo.get('finished').patchValue(true);
        this.router.navigate([FRONTEND_ENDPOINTS.appealIdUpload]);
    }

    public async getStreets(city: string) {
        this.streets = await this.crudService.getStreets(city);
    }

    private _citiesFilter(name: string): any[] {
        const filterValue = name.toLowerCase();
        const citiesWithNameAtStart = this.cities.filter(city => city.toLowerCase().indexOf(filterValue) === 0);
        const otherFilteredCities = this.cities.filter(city => city.toLowerCase().indexOf(filterValue) > 0);
        return [...citiesWithNameAtStart, ...otherFilteredCities];
    }

    private _streetFilter(name: string): any[] {
        const filterValue = name.toLowerCase();
        const streetsWithNameAtStart = this.streets.filter(street => street.toLowerCase().indexOf(filterValue) === 0);
        const otherFilteredStreets = this.streets.filter(street => street.toLowerCase().indexOf(filterValue) > 0);
        return [...streetsWithNameAtStart, ...otherFilteredStreets];
    }

    displayCityFn(city?: string): string | undefined {
        return city ? city : undefined;
    }

    displayStreetFn(street?: string): string | undefined {
        return street ? street : undefined;
    }

    filterCitiesFunc() {
        this.filteredCities = this.ticketService.userInfo.get('city').valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : '')),
            map(name => (name ? this._citiesFilter(name) : this.cities.slice())),
        );
    }

    filterStreetsFunc() {
        this.filteredStreets = this.ticketService.userInfo.get('address').valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : '')),
            map(name => (name ? this._streetFilter(name) : this.streets.slice())),
        );
    }

    deleteStreet() {
        this.ticketService.userInfo.get('address').reset();
        this.ticketService.userInfo
            .get('city')
            .valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(city => {
                const isCityExists = this.cities.filter(ct => {
                    return ct === city;
                });
                if (isCityExists.length !== 1) {
                    this.ticketService.userInfo.get('address').disable();
                }
            });
    }

    ngOnDestroy() {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }
}
