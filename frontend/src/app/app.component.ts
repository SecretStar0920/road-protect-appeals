import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { TrackingService } from './core/services/tracking/tracking.service';
// import { slideInAnimation } from './app.animations';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    // animations: [slideInAnimation]
})
export class AppComponent implements OnInit {
    title = 'RoadProtect';

    constructor(
        private metaTagService: Meta,
        private trackingService: TrackingService,
        private gtmService: GoogleTagManagerService,
    ) {
        // It's important to know why I'm not using the ActivatedRoute here to
        // get the query paramters. Query parameters are extracted on a route
        // level but I want this to ALWAYS trigger, no matter what route you've
        // landed on. Due to this, I need to extract query parameters on a full
        // URL level and not on a component level.
        // For the code below, check:
        // https://stackoverflow.com/questions/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
        this.trackingService.storeTrackingParameters(
            decodeURI(window.location.search)
                .replace('?', '')
                .split('&')
                .map(param => param.split('='))
                .reduce((values, [key, value]) => {
                    values[key] = value;
                    return values;
                }, {}),
        );
    }

    ngOnInit(): void {
        // This adds the GTM scripts to the project
        this.gtmService.addGtmToDom();
        const robotsTag = environment.production ? 'index,follow' : 'index,nofollow';
        this.metaTagService.addTags([
            { name: 'robots', content: robotsTag },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { charset: 'UTF-8' },
        ]);
    }
}
