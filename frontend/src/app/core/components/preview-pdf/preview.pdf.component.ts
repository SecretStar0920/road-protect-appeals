import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ImgPathService } from '../../services/img-path.service';
import { isMobile } from '../../helpers/is-mobile';

@Component({
    selector: 'preview-pdf',
    templateUrl: './preview.pdf.component.html',
    styleUrls: ['./preview.pdf.component.scss'],
})
export class PreviewPdfComponent implements OnChanges {
    @Input() previewPdfUrl: string;
    public isMobile = false;
    constructor(public readonly imgPathService: ImgPathService) {
        this.isMobile = isMobile();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            isMobile() &&
            changes['previewPdfUrl'].currentValue &&
            changes['previewPdfUrl'].currentValue !== changes['previewPdfUrl'].previousValue
        ) {
            const downloadLink = document.createElement('a');
            downloadLink.href = this.previewPdfUrl;
            downloadLink.style.display = 'none';
            downloadLink.target = '_blank';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        }
    }

    public closeDialog(): void {
        this.previewPdfUrl = undefined;
    }
}
