import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fileUploadConfig } from '../../../config/file-upload';
import { FRONTEND_ENDPOINTS } from '../../../config/frontend-endpoints';
import { DocumentModel } from '../../../core/models/document.model';
import { CrudService } from '../../../core/services/crud.service';
import { ImgPathService } from '../../../core/services/img-path.service';
import { PopupService } from '../../../core/services/popup.service';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
    selector: 'app-id-upload',
    templateUrl: './id-upload.component.html',
    styleUrls: ['./id-upload.component.scss'],
    // tslint:disable-next-line:no-host-metadata-property
    host: {
        class: 'column-grow',
    },
})
export class IdUploadComponent implements OnInit {
    private allowedFileTypes = ['image/jpeg', 'image/png'];

    uploadedIdPic: DocumentModel;
    public loadingId = false;

    @ViewChild('ticketImageInput', null) ticketImageInput: HTMLInputElement;
    @ViewChild('otherPic', null) otherPic: HTMLInputElement;

    constructor(
        public readonly imgPathService: ImgPathService,
        public readonly ticketService: TicketService,
        private readonly crudService: CrudService,
        private readonly router: Router,
        private popupService: PopupService,
    ) {}

    async ngOnInit() {
        this.uploadedIdPic = this.ticketService.idPic;
    }

    processPic(imageInput: HTMLInputElement) {
        const file: File = imageInput.files[0];
        if (!this.allowedFileTypes.includes(file.type)) {
            this.popupService.openDialog({
                title: 'שגיאה',
                content: `רק קבצים מסוג תמונה מותרים (png, jpeg, jpg)`,
            });
            return;
        }
        const reader = new FileReader();

        reader.addEventListener('load', async (event: ProgressEvent) => {
            this.loadingId = true;
            const [data, base64] = event.target['result'].split('base64,');
            const [_, mimeType] = data.split(':');
            this.uploadedIdPic = await this.crudService.uploadTicketDocument(
                base64,
                mimeType.replace(';', ''),
                fileUploadConfig.idPic.name,
                +fileUploadConfig.idPic.typeCode,
            );
            this.loadingId = false;
        });
        reader.addEventListener(
            'error',
            error => {
                console.log('error' + error);
            },
            false,
        );
        reader.readAsDataURL(file);
    }

    public async removePicFromTicketPicArray(index: number) {
        await this.crudService.deleteDocumentById(this.uploadedIdPic.id);
        this.uploadedIdPic = null;
    }

    public onSubmit() {
        this.ticketService.idPic = this.uploadedIdPic;
        this.router.navigate([FRONTEND_ENDPOINTS.appealSummary]);
    }
}
