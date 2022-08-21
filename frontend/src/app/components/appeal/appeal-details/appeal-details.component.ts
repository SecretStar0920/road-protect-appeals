import { Component, OnInit } from '@angular/core';
import { ViolationModel } from '../../../core/models/violation.model';
import { ImgPathService } from '../../../core/services/img-path.service';
import { TicketService } from '../../../core/services/ticket.service';
import { IMetaData, IMetadataType } from '../../../core/models/ui-metadata.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { CrudService } from 'src/app/core/services/crud.service.js';
import { Router } from '@angular/router';
import { get, isEmpty } from 'lodash';
import { SavedReasonsService } from './services/saved-reasons.service';
import { CurrentPathService } from './services/current-path.service';
import { ISubmitModalResponses, SubmitModalComponent } from './submit-modal/submit-modal.component';
import { PopupService } from '../../../core/services/popup.service';
import { Socket } from 'ngx-socket-io';

@Component({
    selector: 'app-appeal-details',
    templateUrl: './appeal-details.component.html',
    styleUrls: ['./appeal-details.component.scss'],
})
export class AppealDetailsComponent implements OnInit {
    loading: boolean = false;
    private violations: Array<ViolationModel>;
    public currentDisplayedObject: any = {};
    public uiMetadata: { [key: string]: IMetaData } = {};
    public topicTree: { [key: string]: any } = {};
    canSubmit: boolean;
    private modalViewDisplayedObject: any = {};
    private pathBeforeOpenModal: string[] = [];
    submitButton: string = '';

    constructor(
        public readonly imgPathService: ImgPathService,
        public readonly ticketService: TicketService,
        private savedReasonsService: SavedReasonsService,
        private currentPathService: CurrentPathService,
        public dialog: MatDialog,
        private popupService: PopupService,
        private socket: Socket,
        private readonly crudService: CrudService,
        private readonly router: Router,
    ) {
        this.violations = this.ticketService.violationsData;
        this.checkIfCanSubmit();
    }

    async ngOnInit() {
        // if violations have not been loaded, then get violations from backend
        if (!this.ticketService.violationsData) {
            await this.ticketService.getViolations();
        }
        await this.initialiseQuestionsAndAnswers();
        this.ticketService.syncTemporarlyPath.subscribe(
            currentPath => (this.currentPathService.currentPath = currentPath),
        );
        if (this.ticketService.routeToEnd()) {
            this.submitButton = 'חזור לסיכום';
        } else {
            this.submitButton = 'זה הכל, בואו נמשיך';
        }
        this.savedReasonsService.initialiseSelectedReasons();
        this.currentPathService.initialiseCurrentPath();
    }

    public get violation(): ViolationModel {
        return this.ticketService.violation;
    }

    public getUiMetadata(key: string): IMetaData {
        return this.uiMetadata[key];
    }

    public getViolationMetadata(violationIndex: number): ViolationModel {
        return this.violations[violationIndex];
    }

    public get currentOptions(): Array<string> {
        return Object.keys(this.currentDisplayedObject);
    }

    public get savedReasons() {
        return this.savedReasonsService.savedReasons;
    }

    private async initialiseQuestionsAndAnswers() {
        const ticketId = this.ticketService.fine.get('id').value;
        const { db, metadata } = await this.crudService.getQuestionsAndAnswers(ticketId);
        this.topicTree = db;
        this.uiMetadata = metadata;
        this.currentDisplayedObject = { ...this.topicTree };
        this.currentPathService.setTopicTree(this.topicTree);
    }

    public async selectViolation(violation: ViolationModel) {
        // don't do anything if currently loading;
        if (this.loading) {
            return;
        }

        this.loading = true;
        if (violation.id.toString() === this.ticketService.fine.get('violationCodes').value) {
            this.ticketService.violation = violation;
        } else {
            // if a different violation is selected: get new questions and answers and reset selected appeal path
            this.ticketService.fine.get('violationCodes').patchValue(violation.id.toString());
            await this.crudService.updateTicket();
            await this.initialiseQuestionsAndAnswers();
            this.ticketService.appealPaths = [];
            this.ticketService.violation = violation;
        }
        this.loading = false;
    }

    public isTopic(step: string): boolean {
        if (get(this.uiMetadata, `${step}.type`, false)) {
            return this.uiMetadata[step].type === IMetadataType.Topic;
        } else {
            return step.includes('topic');
        }
    }

    public isAnswer(step: string): boolean {
        if (get(this.uiMetadata, `${step}.type`, false)) {
            return this.uiMetadata[step].type === IMetadataType.Answer;
        } else {
            return step.includes('answer');
        }
    }

    isSelected(step: string): boolean {
        return this.currentPathService.isSelected(step) || this.savedReasonsService.isSelected(step);
    }

    public isReason(step: string): boolean {
        if (get(this.uiMetadata, `${step}.type`, false)) {
            return (
                this.uiMetadata[step].type === IMetadataType.Reason ||
                this.uiMetadata[step].type === IMetadataType.Answer
            );
        } else {
            return step.includes('reason') || step.includes('answer');
        }
    }

    selectOption(key: string) {
        // don't do anything if currently loading;
        if (this.loading) {
            return;
        }
        const result = this.currentPathService.addToCurrentPath(key);

        // If unselected the reason
        if (!result) {
            this.unselectLast();
            this.checkIfCanSubmit();
            return;
        }
        const nextSelection = this.currentDisplayedObject[key];

        if (this.isNextModal(nextSelection)) {
            this.pathBeforeOpenModal = [...this.currentPathService.currentPath];
            this.openOptionsModal(key, nextSelection);
        } else if (!this.lastOptionIsSelected()) {
            //   if not selected last option then update view
            this.currentDisplayedObject = nextSelection;
        }
        this.checkIfCanSubmit();
    }

    selectOptionFromModal(key: string) {
        this.currentPathService.addToCurrentPath(key);

        const nextSelection = this.modalViewDisplayedObject[key];

        if (this.isNextModal(nextSelection)) {
            this.openOptionsModal(key, nextSelection);
        } else {
            if (this.checkIfCanSubmit()) {
                this.openSubmitModal();
            }
        }
    }

    isNextModal(nextSelection: any) {
        let openModal = false;
        for (const nextKey of Object.keys(nextSelection)) {
            if (this.isAnswer(nextKey)) {
                openModal = true;
            }
        }
        return openModal;
    }

    openOptionsModal(key, nextSelection) {
        this.modalViewDisplayedObject = { ...nextSelection };
        const modalData = {
            modalViewDisplayedObject: this.modalViewDisplayedObject,
            isSelected: this.isSelected.bind(this),
            getUiMetadata: this.getUiMetadata.bind(this),
            title: this.getUiMetadata(key).pageTitle,
        };
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(ModalComponent, {
            data: modalData,
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                this.dismissModal();
            } else {
                this.selectOptionFromModal(result);
            }
        });
    }

    dismissModal() {
        let diff = this.currentPathService.currentPath.length - this.pathBeforeOpenModal.length;

        do {
            this.currentPathService.unselectLast();
            diff = diff - 1;
        } while (diff >= 0);

        this.pathBeforeOpenModal = [];
    }

    openSubmitModal() {
        const modalData = {
            submitButton: this.submitButton,
        };
        this.dialog.closeAll();
        const dialogRef = this.dialog.open(SubmitModalComponent, {
            data: modalData,
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === ISubmitModalResponses.addReasonAndStartAgain) {
                this.addReasonAndStartAgain();
            } else if (result === ISubmitModalResponses.submitReasons) {
                this.submitReasons();
            } else if (result === ISubmitModalResponses.dismiss) {
                this.dismissModal();
            } else {
                this.dismissModal();
            }

            this.modalViewDisplayedObject = {};
        });
    }

    checkIfCanSubmit() {
        this.canSubmit = this.lastOptionIsSelected() || this.savedReasonsService.savedReasons.length > 0;
        return this.canSubmit;
    }

    unselectLast() {
        const key = this.currentPathService.unselectLast();
        let tempObject = { ...this.topicTree };
        this.currentPathService.currentPath.forEach(step => {
            tempObject = tempObject[step];
            return tempObject;
        });
        this.currentDisplayedObject = tempObject;
        this.checkIfCanSubmit();
    }

    lastOptionIsSelected() {
        return this.currentPathService.lastOptionIsSelected();
    }

    public get pageTitle(): string {
        if (!this.violation) {
            return 'בחר';
        }
        return this.violation.genericProperty.btnTxt;
    }

    async back() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        if (this.currentPathService.currentPath.length > 0) {
            this.unselectLast();
        } else {
            this.ticketService.fine.get('violationCodes').patchValue('');
            await this.crudService.updateTicket();
            await this.initialiseQuestionsAndAnswers();
            this.ticketService.appealPaths = [];
            this.ticketService.violation = undefined;
        }
        this.loading = false;
    }

    saveReason() {
        if (!this.lastOptionIsSelected()) {
            return;
        }

        const lastOption = this.currentPathService.currentPath.slice(-1)[0];
        const paragraph = this.currentDisplayedObject[lastOption] || this.modalViewDisplayedObject[lastOption];
        const path = [...this.currentPathService.currentPath, paragraph];
        this.savedReasonsService.savePath(path, this.pathBeforeOpenModal);
        this.currentPathService.currentPath = [];
        this.pathBeforeOpenModal = [];
    }

    addReasonAndStartAgain() {
        this.saveReason();
        this.currentDisplayedObject = { ...this.topicTree };
    }

    async submitReasons() {
        this.loading = true;
        this.saveReason();
        await this.crudService.updateTicket();
        this.loading = false;
        if (this.ticketService.routeToEnd()) {
            return this.router.navigate(['appeal', 'summary']);
        } else {
            return this.router.navigate(['appeal', 'pics']);
        }
    }
}
