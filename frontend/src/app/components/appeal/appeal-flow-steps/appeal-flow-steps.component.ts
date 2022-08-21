import { Component, OnInit } from '@angular/core';
import { fileUploadConfig } from '../../../config/file-upload';
import { FRONTEND_ENDPOINTS } from '../../../config/frontend-endpoints';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
    selector: 'app-appeal-flow-steps',
    templateUrl: './appeal-flow-steps.component.html',
    styleUrls: ['./appeal-flow-steps.component.scss'],
})
export class AppealFlowStepsComponent implements OnInit {
    public tabs = [
        { label: 'פרטי הדוח', path: ['/appeal', 'fine'] },
        { label: 'פרטי הערעור', path: ['/appeal', 'details'] },
        { label: 'העלאת תמונות', path: ['/appeal', 'pics'] },
        { label: 'פרטים אישיים', path: ['/appeal', 'user-info'] },
        { label: 'העלה תעודת זהות', path: [FRONTEND_ENDPOINTS.appealIdUpload] },
        { label: 'סיכום', path: ['/appeal', 'summary'] },
    ];

    constructor(public ticketService: TicketService) {}

    ngOnInit() {}

    public checkComplete(label: string) {
        switch (label) {
            case 'פרטי הדוח':
                return this.ticketService.fine.get('finished').value;
            case 'פרטי הערעור':
                return this.ticketService.appealPaths.length;
            case 'העלאת תמונות':
                return this.ticketService.pics.length;
            case 'פרטים אישיים':
                return this.ticketService.userInfo.get('finished').value;
            case 'העלה תעודת זהות':
                return !!this.ticketService.idPic && this.ticketService.userInfo.get('finished').value;
            default:
                return false;
        }
    }
}
