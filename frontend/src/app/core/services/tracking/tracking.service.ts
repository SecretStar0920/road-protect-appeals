import { Injectable } from '@angular/core';
import { PartnerDetails } from './partner-details';
import { trackingConfig } from '../../../config/tracking';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class TrackingService {
    private readonly PARTNER_STORAGE_KEY = 'partner';

    /**
     * Store all of the tracking parameters that exist in the object, we want
     * this to be case insensitive
     * @param params
     */
    storeTrackingParameters(params: any = {}) {
        const keys = Object.keys(params).filter(key => params.hasOwnProperty(key));
        for (const key of keys) {
            if (/^partner$/i.test(key.trim())) {
                this.setPartner(params[key]);
                continue;
            }
        }
    }

    /**
     * Sets the tracking partner if it exists
     * @param partner
     */
    setPartner(partner: string) {
        if (!partner) {
            return;
        }
        localStorage.setItem(
            this.PARTNER_STORAGE_KEY,
            JSON.stringify({
                partner,
                timestamp: moment().toISOString(),
            }),
        );
    }

    /**
     * Returns the tracking partner if it exists and the timestamp is not older
     * than a certain timestamp.
     */
    getPartner(): string {
        const partnerDetails = JSON.parse(localStorage.getItem(this.PARTNER_STORAGE_KEY) || '{}') as PartnerDetails;
        if (!partnerDetails || !partnerDetails.partner) {
            return '';
        }
        const maximumAge = trackingConfig.partner.maximumAge;
        const oldTimestamp = moment(partnerDetails.timestamp);
        const currentTimestamp = moment();
        const diff = Math.abs(currentTimestamp.diff(oldTimestamp, 'seconds'));
        if (diff > maximumAge) {
            this.resetPartner();
            return '';
        }
        return partnerDetails.partner;
    }

    /**
     * Removes the partner key
     */
    resetPartner() {
        localStorage.removeItem(this.PARTNER_STORAGE_KEY);
    }
}
