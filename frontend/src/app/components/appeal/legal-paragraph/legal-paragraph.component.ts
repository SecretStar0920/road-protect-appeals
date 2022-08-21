import { ImgPathService } from 'src/app/core/services/img-path.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/core/services/crud.service.js';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/core/services/popup.service.js';
import { IMetaData } from '../../../core/models/ui-metadata.model';
import { GlobalLoadingService } from '../../../core/services/global-loading.service';
import { LegalParagraphService } from './service/legal-paragraph.service';
import { isEmpty } from 'lodash';

@Component({
    selector: 'app-legal-paragraph',
    templateUrl: './legal-paragraph.component.html',
    styleUrls: ['./legal-paragraph.component.scss'],
})
export class LegalParagraphComponent implements OnInit {
    public pencilIcon = this.imgPathService.editUiIcon;
    public pdfIcon = this.imgPathService.uploadUiIcon;
    public submissionParagraph: string = '';
    public previewPdfUrl;
    public uiMetadata: { [key: string]: IMetaData } = {};
    public topicTree: { [key: string]: any } = {};

    constructor(
        private readonly ticketService: TicketService,
        public readonly imgPathService: ImgPathService,
        private readonly crudService: CrudService,
        private readonly globalLoadingService: GlobalLoadingService,
        private readonly router: Router,
        private readonly popupService: PopupService,
        private legalParagraphService: LegalParagraphService,
    ) {}

    async ngOnInit() {
        await this.initialiseQuestionsAndAnswers();
        const ticketId = this.ticketService.fine.get('id').value;
        this.submissionParagraph = await this.legalParagraphService.getLegalParagraphs(ticketId);
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
        if (!this.ticketService.violation) {
            return '';
        }
        return this.ticketService.violation.genericProperty.btnTxt;
    }

    public get reasons() {
        if (isEmpty(this.uiMetadata)) {
            return;
        }
        return this.ticketService.appealPaths.map((p: string[]) => this.uiMetadata[p[0]].btnTxt);
    }

    public async createAndSendEmail(): Promise<void> {
        this.ticketService.finalParagraph = this.submissionParagraph;
        const response = await this.crudService.submitAppeal(this.submissionParagraph);
        if (response && response.success) {
            this.router.navigate(['/appeal', 'finished']);
        }
    }

    public async downloadPdf(): Promise<void> {
        if (this.globalLoadingService.loading) {
            return;
        }
        this.ticketService.finalParagraph = this.submissionParagraph;
        const response = await this.crudService.generateTicketDefense();
        if (response.url) {
            this.previewPdfUrl = response.url;
        } else {
            this.popupService.openDialog({ title: 'שגיאה', content: 'קרתה שגיאה בייצור הקובץ' });
        }
    }
}
