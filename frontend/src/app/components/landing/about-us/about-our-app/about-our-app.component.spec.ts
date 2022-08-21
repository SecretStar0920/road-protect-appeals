import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOurAppComponent } from './about-our-app.component';

describe('AboutOurAppComponent', () => {
    let component: AboutOurAppComponent;
    let fixture: ComponentFixture<AboutOurAppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AboutOurAppComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutOurAppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
