import { Component, Input, Output } from '@angular/core';
import { CrudService } from '../../services/crud.service';
import { GlobalLoadingService } from '../../services/global-loading.service';

@Component({
    selector: 'rp-button',
    templateUrl: './rp-button.component.html',
    styleUrls: ['./rp-button.component.scss'],
})
export class RpButtonComponent {
    @Input() buttonText: string = '';
    @Input() disabled: boolean = false;
    @Input() type: string = 'button';
    @Input() onClick: () => void = () => {};

    constructor(private readonly globalLoadingService: GlobalLoadingService) {}

    public get isLoading(): boolean {
        return !!this.globalLoadingService.loading;
    }
}
