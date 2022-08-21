import { TestBed } from '@angular/core/testing';

import { OnBoardingPropertyBagService } from './on-boarding-property-bag.service';

describe('OnBoardingPropertyBagService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: OnBoardingPropertyBagService = TestBed.get(OnBoardingPropertyBagService);
        expect(service).toBeTruthy();
    });
});
