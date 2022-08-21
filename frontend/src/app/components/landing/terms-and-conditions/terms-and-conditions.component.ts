import { Component, OnInit } from '@angular/core';
import TnC from '../../../../assets/jsons/term-and-conditions-text.json';

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit {
    termAndConditionsText = TnC;

    constructor() {}

    ngOnInit() {}

    closeWin() {
        window.close();
    }
}
