import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImgPathService } from 'src/app/core/services/img-path.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    host: {
        class: 'dialog',
    },
})
export class ModalComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            modalViewDisplayedObject: any;
            isSelected: any;
            getUiMetadata: any;
            title: string;
        },
        public imgPathService: ImgPathService,
        public dialogRef: MatDialogRef<ModalComponent>,
    ) {}

    ngOnInit() {}

    public get currentOptions(): Array<string> {
        return Object.keys(this.data.modalViewDisplayedObject);
    }

    public get title(): string {
        return this.data.title;
    }

    public isSelected(step: string) {
        return this.data.isSelected(step);
    }

    public getUiMetadata(id: string) {
        return this.data.getUiMetadata(id);
    }

    public selectOptionFromModal(selection: string) {
        this.dialogRef.close(selection);
    }

    public dismiss(): void {
        this.dialogRef.close();
    }
}
