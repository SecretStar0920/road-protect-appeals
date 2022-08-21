import { Component, OnInit, ViewChild } from '@angular/core';
import { fileUploadConfig } from '../../../config/file-upload';

import { ImgPathService } from '../../../core/services/img-path.service';
import { PopupService } from '../../../core/services/popup.service';
import { TicketService } from '../../../core/services/ticket.service';
import { CrudService } from '../../../core/services/crud.service';
import { DocumentModel } from 'src/app/core/models/document.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-fine-pics',
    templateUrl: './fine-pics.component.html',
    styleUrls: ['./fine-pics.component.scss'],
    // tslint:disable-next-line:no-host-metadata-property
    host: {
        class: 'column-grow',
    },
})
export class FinePicsComponent implements OnInit {
    private allowedFileTypes = ['image/jpeg', 'image/png'];

    uploadedFinePicsArray: DocumentModel[] = [];
    otherPicsArray: DocumentModel[] = [];
    public loadingFine = false;
    public loadingOther = false;

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
        const ticketId = this.ticketService.fine.get('id').value;
        const documents = await this.crudService.getDocumentsByTicketId(ticketId);
        // This was updated to account for the fact that RP ZA only accepts multiple images for type code 1060
        this.uploadedFinePicsArray = documents.filter(
            document =>
                document.typeCode === fileUploadConfig.finePic.typeCode &&
                document.description === fileUploadConfig.finePic.name,
        );
        this.otherPicsArray = documents.filter(
            document =>
                document.typeCode === fileUploadConfig.attachmentPics.typeCode &&
                document.description === fileUploadConfig.attachmentPics.name,
        );
    }

    processPic(imageInput: HTMLInputElement, finePic = true) {
        const totalLength = this.uploadedFinePicsArray.length + this.otherPicsArray.length;
        if (totalLength >= 10) {
            this.popupService.openDialog({
                title: 'שגיאה',
                content: `10 תמונות מותרות`,
            });
            return;
        }
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
            finePic ? (this.loadingFine = true) : (this.loadingOther = true);
            const config = finePic ? fileUploadConfig.finePic : fileUploadConfig.attachmentPics;
            const [data, base64] = event.target['result'].split('base64,');
            const [_, mimeType] = data.split(':');
            const document = await this.crudService.uploadTicketDocument(
                base64,
                mimeType.replace(';', ''),
                config.name,
                +config.typeCode,
            );
            finePic ? this.uploadedFinePicsArray.push(document) : this.otherPicsArray.push(document);
            this.loadingOther = false;
            this.loadingFine = false;
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
        await this.crudService.deleteDocumentById(this.uploadedFinePicsArray[index].id);
        this.uploadedFinePicsArray.splice(index, 1);
    }

    public async removePicFromOtherPicsArray(index: number) {
        await this.crudService.deleteDocumentById(this.otherPicsArray[index].id);
        this.otherPicsArray.splice(index, 1);
    }

    public onSubmit() {
        this.ticketService.pics = [...this.uploadedFinePicsArray, ...this.otherPicsArray];
        this.router.navigate(['/appeal', 'user-info']);
    }
}
