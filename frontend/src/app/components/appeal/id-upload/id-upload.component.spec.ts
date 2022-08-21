import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdUploadComponent } from './id-upload.component';

describe('IdUploadComponent', () => {
    let component: IdUploadComponent;
    let fixture: ComponentFixture<IdUploadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IdUploadComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IdUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
