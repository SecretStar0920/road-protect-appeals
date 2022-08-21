import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FineDetailsComponent } from './fine-details.component';

describe('FineDetailsComponent', () => {
    let component: FineDetailsComponent;
    let fixture: ComponentFixture<FineDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FineDetailsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FineDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
