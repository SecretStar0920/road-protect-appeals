import { Component, OnInit } from '@angular/core';
import { appealCost } from '../../../config/appeal-cost';

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
    appealCost = appealCost.amountInShekels;
    constructor() {}

    ngOnInit() {}
}
