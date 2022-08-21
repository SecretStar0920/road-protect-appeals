import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImgPathService } from '../../../../core/services/img-path.service';

export enum ISubmitModalResponses {
    addReasonAndStartAgain = 'addReasonAndStartAgain',
    submitReasons = 'SubmitReasons',
    dismiss = 'Dismiss',
}

@Component({
    selector: 'app-submit-modal',
    templateUrl: './submit-modal.component.html',
    styleUrls: ['./submit-modal.component.scss'],
})
export class SubmitModalComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { submitButton: string },
        public imgPathService: ImgPathService,
        public dialogRef: MatDialogRef<SubmitModalComponent>,
    ) {}

    ngOnInit() {}

    public submitReasons() {
        this.dialogRef.close(ISubmitModalResponses.submitReasons);
    }

    public addReasonAndStartAgain() {
        this.dialogRef.close(ISubmitModalResponses.addReasonAndStartAgain);
    }

    public dismiss(): void {
        this.dialogRef.close(ISubmitModalResponses.dismiss);
    }
}
