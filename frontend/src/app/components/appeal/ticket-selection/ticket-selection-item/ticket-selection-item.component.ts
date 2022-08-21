import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tick } from '@angular/core/testing';
import { TicketModel } from '../../../../core/models/ticket.model';
import { CrudService } from '../../../../core/services/crud.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { Router } from '@angular/router';
import { PopupService } from '../../../../core/services/popup.service';
import { ImgPathService } from '../../../../core/services/img-path.service';
import { TicketStatus } from '../../../../core/enums/ticket-status.enum';
import moment from 'moment';
import { uniq, isNil } from 'lodash';
import { fileUploadConfig } from '../../../../config/file-upload';
import { DocumentModel } from '../../../../core/models/document.model';
import { IMetaData } from '../../../../core/models/ui-metadata.model';
import violationData from '../../../../../assets/jsons/violations.json';

@Component({
    selector: 'app-ticket-selection-item',
    templateUrl: './ticket-selection-item.component.html',
    styleUrls: ['./ticket-selection-item.component.scss'],
})
export class TicketSelectionItemComponent implements OnInit {
    @Input() ticket: TicketModel;
    @Output() ticketDeleted = new EventEmitter<any>();
    public previewPdfUrl;
    public uiMetadata: { [key: string]: IMetaData } = {};
    public topicTree: { [key: string]: any } = {};
    private oldViolationsData = violationData;

    constructor(
        private readonly crudService: CrudService,
        private readonly ticketService: TicketService,
        private readonly router: Router,
        private readonly popupService: PopupService,
        public readonly imgPathService: ImgPathService,
    ) {}

    async ngOnInit() {
        await this.initialiseQuestionsAndAnswers(this.ticket.id);
    }

    private async initialiseQuestionsAndAnswers(ticketId: number) {
        const { db, metadata } = await this.crudService.getQuestionsAndAnswers(ticketId);
        this.topicTree = db;
        this.uiMetadata = metadata;
    }

    public getClassByTicketStatus(name: string) {
        switch (name) {
            case TicketStatus.PENDING:
            case TicketStatus.PENDING_MEMBERSHIP:
                return 'ticket__status--incomplete';
            case TicketStatus.SENT_TO_MUNICIPALITY:
            case TicketStatus.GUILTY:
            case TicketStatus.DISMISSED:
            case TicketStatus.REFUNDED:
                return 'ticket__status--sent';
            case TicketStatus.AWAITING_PAYMENT:
            case TicketStatus.NOT_ENGAGING:
                return 'ticket__status--unpaid';
            case TicketStatus.PAID_CREDIT_CARD:
            case TicketStatus.PAID_MEMBERSHIP:
                return 'ticket__status--paid';
            default:
                return '';
        }
    }

    public isIncomplete(name: string): boolean {
        return name === TicketStatus.PENDING || name === TicketStatus.PENDING_MEMBERSHIP;
    }

    public isSent(name: string): boolean {
        return (
            name === TicketStatus.SENT_TO_MUNICIPALITY ||
            name === TicketStatus.GUILTY ||
            name === TicketStatus.DISMISSED ||
            name === TicketStatus.REFUNDED
        );
    }

    public isUnpaid(name: string): boolean {
        return name === TicketStatus.AWAITING_PAYMENT || name === TicketStatus.NOT_ENGAGING;
    }

    public isPaid(name: string): boolean {
        return name === TicketStatus.PAID_CREDIT_CARD || name === TicketStatus.PAID_MEMBERSHIP;
    }

    public isApproved(name: string): boolean {
        return name === TicketStatus.DISMISSED;
    }

    public isGuilty(name: string): boolean {
        return name === TicketStatus.GUILTY;
    }

    public getViolation(violationCode: string) {
        // Get violation from ticket service (from Infrasonic's list of violations)
        const v = this.ticketService.violationsData.find(data => data.id === violationCode);
        // If violation is not found get it from outdated json constant (for legacy data)
        if (isNil(v)) {
            const oldViolation = this.oldViolationsData.find(data => data.id === +violationCode);
            return oldViolation ? oldViolation.btnTxt : '';
        } else {
            return v ? v.genericProperty.btnTxt : '';
        }
    }

    public getDateAndTime(dateTime: string, type: 'date' | 'time') {
        if (!dateTime) {
            return '';
        }
        const [date, time] = dateTime.split(' ');
        return type === 'date' ? moment(date).format('DD/MM/YYYY') : time;
    }

    public getTopicsForTicket(questionsAndAnswers: string[][]): string {
        if (!Object.keys(this.uiMetadata).length) {
            return '';
        }
        const topics = questionsAndAnswers.reduce((accumulator, currentValue) => {
            const metadata = this.uiMetadata[currentValue[0]];
            const btnTxt = metadata ? metadata.btnTxt : '';
            accumulator.push(`${btnTxt}`);
            return accumulator;
        }, []);
        return uniq(topics).join(',');
    }

    public onClick(ticket: TicketModel) {
        this.ticketService.updateTicket(ticket);
        this.ticketService.appealPaths = ticket.questionsAndAnswers;
        this.ticketService.pics = ticket.documents;
        this.ticketService.idPic = ticket.documents.find(
            document =>
                document.typeCode === fileUploadConfig.idPic.typeCode &&
                document.description === fileUploadConfig.idPic.name,
        );
        if (this.isIncomplete(ticket.ticketStatusName)) {
            this.ticketService.fine.get('finished').patchValue(false);
            this.ticketService.userInfo.get('finished').patchValue(false);
            return this.router.navigate(['appeal', 'fine']);
        }
        if (this.isUnpaid(ticket.ticketStatusName)) {
            this.ticketService.fine.get('finished').patchValue(true);
            this.ticketService.userInfo.get('finished').patchValue(true);
            return this.router.navigate(['appeal', 'summary', 'payment']);
        }
        if (this.isPaid(ticket.ticketStatusName)) {
            this.ticketService.fine.get('finished').patchValue(true);
            this.ticketService.userInfo.get('finished').patchValue(true);
            return this.router.navigate(['appeal', 'summary', 'last-step']);
        }
    }

    private async confirmDelete(ticketId: number) {
        await this.crudService.deleteTicket(ticketId);
    }

    public async delete(ticketId: number) {
        this.popupService.openDialog({
            title: 'אזהרה',
            content: 'האם אתה בטח שברצונך למחוק את הערעור?',
            okButton: {
                text: 'כן',
                callback: () => {
                    this.confirmDelete(ticketId);
                    this.ticketDeleted.emit();
                },
            },
            cancelButton: {
                text: 'לא',
                callback: () => {},
            },
        });
    }

    public async downloadPdf(ticketId: number | string) {
        const stringTicketId = String(ticketId);
        const response = await this.crudService.getLatestPdfDocument(stringTicketId);
        if (response && response.url) {
            this.previewPdfUrl = response.url;
        }
    }

    public isDocument(document: DocumentModel): boolean {
        return (
            document.typeCode === fileUploadConfig.finePic.typeCode ||
            document.typeCode === fileUploadConfig.idPic.typeCode ||
            document.typeCode === fileUploadConfig.attachmentPics.typeCode
        );
    }

    public async voteUp(ticket: TicketModel) {
        if (ticket.ticketStatusName === TicketStatus.DISMISSED) {
            return;
        }
        ticket.ticketStatusName = TicketStatus.DISMISSED;
        await this.crudService.updateTicketStatus(TicketStatus.DISMISSED, ticket.id.toString());
    }

    public async voteDown(ticket: TicketModel) {
        if (ticket.ticketStatusName === TicketStatus.GUILTY) {
            return;
        }
        ticket.ticketStatusName = TicketStatus.GUILTY;
        await this.crudService.updateTicketStatus(TicketStatus.GUILTY, ticket.id.toString());
    }

    documentsToShow(ticket: TicketModel): DocumentModel[] {
        return ticket.documents.filter(document => this.isDocument(document));
    }
}
