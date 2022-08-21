import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImgPathService } from '../../services/img-path.service';
import { DialogData } from '../../services/popup.service';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss'],
    // tslint:disable-next-line:no-host-metadata-property
    host: { class: 'dialog' },
})
export class ErrorDialogComponent {
    constructor(
        public readonly dialogRef: MatDialogRef<ErrorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly data: DialogData,
        public readonly imgPathService: ImgPathService,
    ) {}

    public dismiss(): void {
        this.dialogRef.close();
    }

    public get title() {
        return this.data.title;
    }

    public get content() {
        if (!(typeof this.data.content === 'string' || this.data.content instanceof String)) {
            this.data.content = JSON.stringify(this.data.content);
        }
        return this.data.content;
    }

    public get okButtonText(): string {
        return this.data.okButton ? this.data.okButton.text : 'הבנתי';
    }

    public get cancelButtonText(): string | undefined {
        return this.data.cancelButton ? this.data.cancelButton.text : undefined;
    }

    public async onOkButtonClick() {
        if (this.data.okButton) {
            await this.data.okButton.callback();
        }
        this.dismiss();
    }

    public async onCancelButtonClick() {
        if (this.data.cancelButton) {
            await this.data.cancelButton.callback();
        }
        this.dismiss();
    }
}
