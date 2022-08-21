import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ImgPathService } from '../../../../core/services/img-path.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { CrudService } from '../../../../core/services/crud.service';
import { isEmpty } from 'lodash';
import { ViolationModel } from 'src/app/core/models/violation.model';
import { TicketStatus } from 'src/app/core/enums/ticket-status.enum';
import { Router } from '@angular/router';
import { IMetaData } from '../../../../core/models/ui-metadata.model';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
    @ViewChild('firstBox', { static: false }) private firstBox: ElementRef;
    @ViewChild('secondBox', { static: false }) private secondBox: ElementRef;
    @ViewChild('thirdBox', { static: false }) private thirdBox: ElementRef;
    @ViewChild('fourthBox', { static: false }) private fourthBox: ElementRef;
    @ViewChild('expFirstBox', { static: false }) private expFirstBox: ElementRef;
    @ViewChild('expSecondBox', { static: false })
    private _violation: ViolationModel;
    public uiMetadata: { [key: string]: IMetaData } = {};
    public topicTree: { [key: string]: any } = {};

    constructor(
        private readonly ticketService: TicketService,
        public readonly imgPathService: ImgPathService,
        private readonly crudService: CrudService,
        private readonly router: Router,
    ) {}

    async ngOnInit() {
        await this.initialiseQuestionsAndAnswers();
        // if violations have not been loaded, then get violations from backend
        if (!this.ticketService.violationsData) {
            await this.ticketService.getViolations();
        }
    }

    private async initialiseQuestionsAndAnswers() {
        const ticketId = this.ticketService.fine.get('id').value;
        const { db, metadata } = await this.crudService.getQuestionsAndAnswers(ticketId);
        this.topicTree = db;
        this.uiMetadata = metadata;
    }

    public get userInfo() {
        return this.ticketService.userInfo;
    }

    public get fine() {
        return this.ticketService.fine;
    }

    public get violation() {
        if (!this._violation) {
            this._violation = this.ticketService.violationsData.find(
                violation => violation.id === this.ticketService.fine.get('violationCodes').value,
            );
        }
        return this._violation.genericProperty.btnTxt;
    }

    public get reasons() {
        if (isEmpty(this.uiMetadata)) {
            return [];
        }
        return this.ticketService.appealPaths.map((p: string[]) => {
            return this.uiMetadata[p[0]].btnTxt + (p.length > 1 ? ' - ' + this.uiMetadata[p[1]].btnTxt : '');
        });
    }

    filterPart1and2Objects(obj, part) {
        if (!obj || !part) {
            return;
        }
        const raw = obj;
        let allowed = [];
        if (part === 'part1') {
            allowed = ['email', 'fullName', 'id', 'phone', 'fullAddress'];
        }
        if (part === 'part2') {
            allowed = [
                'reportCity',
                'reportTime',
                'reportStreet',
                'vehicleNumber',
                'fullVehicleDetails',
                'amountDue',
                'reportDate',
            ];
        }

        const filtered = Object.keys(raw)
            .filter(key => allowed.includes(key))
            // tslint:disable-next-line:no-shadowed-variable
            .reduce((obj, key) => {
                return {
                    ...obj,
                    [key]: raw[key],
                };
            }, {});
        return filtered;
    }

    async onSubmit() {
        await this.crudService.updateTicketStatus(TicketStatus.AWAITING_PAYMENT);
        this.router.navigate(['/appeal', 'summary', 'payment']);
    }
}
