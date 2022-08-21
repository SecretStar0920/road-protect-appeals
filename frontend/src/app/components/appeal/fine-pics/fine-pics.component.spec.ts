import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinePicsComponent } from './fine-pics.component';

describe('FinePicsComponent', () => {
    let component: FinePicsComponent;
    let fixture: ComponentFixture<FinePicsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FinePicsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FinePicsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
