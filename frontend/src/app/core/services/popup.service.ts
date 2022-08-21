import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

interface DialogButton {
    text: string;
    callback: () => void;
}

export interface DialogData {
    title: string;
    content: any;
    okButton?: DialogButton;
    cancelButton?: DialogButton;
}

@Injectable({
    providedIn: 'root',
})
export class PopupService {
    constructor(public dialog: MatDialog) {}

    openDialog(data: DialogData): void {
        if (data.content.hasOwnProperty('message')) {
            data.content = data.content.message;
        }
        if (!(data.content instanceof String)) {
            data.content = JSON.stringify(data.content);
        }
        this.dialog.open(ErrorDialogComponent, {
            width: 'auto',
            data,
        });
    }
}
