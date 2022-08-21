import { Component, OnInit } from '@angular/core';
import { ImgPathService } from '../../../../core/services/img-path.service';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
    constructor(public readonly imgPathService: ImgPathService) {}

    ngOnInit() {}
}
