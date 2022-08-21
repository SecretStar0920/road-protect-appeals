import { CrudService } from '../../../core/services/crud.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnBoardingPropertyBagService } from './on-boarding-property-bag.service';
import { OnBoardingInput } from './on-boarding-input';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'on-boarding',
    templateUrl: './on-boarding.component.html',
    styleUrls: ['./on-boarding.component.scss'],
    // tslint:disable-next-line:no-host-metadata-property
    host: {
        class: 'column-grow',
    },
    // providers: [OnBoardingPropertyBagService]
})
export class OnBoardingComponent implements OnInit, OnDestroy {
    constructor(
        private propertyBag: OnBoardingPropertyBagService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    data: OnBoardingInput[];
    unsubscriber$ = new Subject<any>();
    // pageNum: number;
    activeData: OnBoardingInput;

    get pageNum(): number {
        return this.propertyBag.activePage;
    }

    set pageNum(value: number) {
        this.propertyBag.activePage = value;
    }

    nextPage(): void {
        this.pageNum++;
        if (this.pageNum >= this.data.length) {
            this.router.navigate(['/start']);
        }
    }

    ngOnInit() {
        if (!this.pageNum) {
            this.pageNum = 0;
        }
        if (this.pageNum >= 3) {
            this.router.navigate(['/start']);
        } else {
            this.getData();
        }
    }
    sliderStyle() {
        const field = 'translateX(' + this.pageNum * 100 * (1 / this.data.length) + '%)';
        const res = { transform: field };
        return res;
    }
    getData() {
        this.propertyBag
            .getData()
            .pipe(takeUntil(this.unsubscriber$))
            .subscribe(data => {
                (this.data = data),
                    this.route.paramMap.subscribe(
                        info => {
                            const p = +info.get('page');
                            this.activeData = this.data[p];
                            this.pageNum = p;
                        },
                        error => console.error(error),
                    );
            });
    }

    getImgName(value: string) {
        if (value) {
            let arr = [];
            arr = value.split('\\');
            return arr[arr.length - 1];
        }
    }

    ngOnDestroy() {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }
}
