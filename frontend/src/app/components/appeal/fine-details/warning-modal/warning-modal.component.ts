import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ImgPathService } from '../../../../core/services/img-path.service';

@Component({
    selector: 'app-warning-modal',
    templateUrl: './warning-modal.component.html',
    styleUrls: ['./warning-modal.component.scss'],
    // tslint:disable-next-line: no-host-metadata-property
    host: { class: 'dialog' },
})
export class WarningModalComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<WarningModalComponent>, public imgPathService: ImgPathService) {}

    ngOnInit() {}

    public dismiss(): void {
        this.dialogRef.close();
    }
}
