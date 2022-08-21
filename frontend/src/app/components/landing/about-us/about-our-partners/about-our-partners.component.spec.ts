import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOurPartnersComponent } from './about-our-partners.component';

describe('AboutOurPartnersComponent', () => {
    let component: AboutOurPartnersComponent;
    let fixture: ComponentFixture<AboutOurPartnersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AboutOurPartnersComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutOurPartnersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
