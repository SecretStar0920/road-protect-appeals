import { Component } from '@angular/core';
import { ImgPathService } from 'src/app/core/services/img-path.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    constructor(public readonly imgPathService: ImgPathService) {}
}
