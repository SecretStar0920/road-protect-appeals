import { Router } from '@angular/router';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/crud.service.js';
import { Courthouse } from 'src/app/core/models/courthouse.model.js';
import { Socket } from 'ngx-socket-io';
import { PopupService } from '../../../core/services/popup.service';

@Component({
    selector: 'app-finished',
    templateUrl: './finished.component.html',
    styleUrls: ['./finished.component.scss'],
    // tslint:disable-next-line:no-host-metadata-property
    host: {
        class: 'column-grow',
    },
})
export class FinishedComponent implements OnInit {
    private municipalities: Courthouse[] = [];

    public activeMunicipality: Courthouse;

    constructor(
        public readonly ticketService: TicketService,
        private readonly crudService: CrudService,
        private readonly router: Router,
        private popupService: PopupService,
        private socket: Socket,
    ) {}

    async ngOnInit() {
        this.municipalities = await this.crudService.getCourtHouses();
        this.activeMunicipality = this.municipalities.find(
            dpet =>
                (dpet.City || '').toLowerCase().trim() ===
                this.ticketService.fine.get('city').value.toLowerCase().trim(),
        );

        this.socket
            .fromEvent('notification')
            .subscribe((result: { message: string; event?: string; type?: string; data?: any }) => {
                if (result) {
                    this.popupService.openDialog({ title: 'לידיעתכם ', content: result.message });
                }
            });
    }

    public foundPhone(city: string): boolean {
        if (!this.activeMunicipality) {
            return false;
        }
        const phone = this.activeMunicipality['Fax/Mail'];
        return !!phone;
    }

    public getPhone(city: string): string {
        return this.activeMunicipality['Fax/Mail'];
    }

    public async reset(): Promise<void> {
        this.ticketService.restartProcess();
        this.ticketService.fine.get('finished').patchValue(false);
        this.ticketService.userInfo.get('finished').patchValue(false);
        this.router.navigate(['/appeal']);
    }
}
