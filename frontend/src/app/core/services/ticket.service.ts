import { ViolationModel } from '../models/violation.model';
import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IdentityCardNumberValidator } from '../validations/identity.validator';
import regexes from '../regex/regex.json';
import { DocumentModel } from '../models/document.model';
import { TicketModel } from '../models/ticket.model';
import { IMetaData } from '../models/ui-metadata.model';

// TODO: Mocks:
import paragraphs from '../../../assets/jsons/legal-paragraphs.json';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TicketService {
    public fine: FormGroup;
    public pics: DocumentModel[] = [];
    public idPic: DocumentModel = null;
    public violationsData: ViolationModel[];
    public violation: ViolationModel;

    public appealPaths: Array<Array<string>> = [];
    public userInfo: FormGroup;
    public finalParagraph: string = '';
    public payment: FormGroup;

    public hasPaid: boolean = false;
    public syncTemporarlyPath: Subject<any> = new Subject();
    public ticketStatusList: { [key: number]: string } = {};

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.initializeForms();
    }

    public getViolations() {
        return this.http
            .get<ViolationModel[]>(`${environment.baseUrl}/appeal-details/violations`)
            .toPromise()
            .then(result => {
                this.violationsData = result;
            });
    }

    private initializeFineDetailsForm(): void {
        this.fine = this.fb.group({
            id: [-1],
            ticketType: [''],
            citationNo: ['', [Validators.required, Validators.pattern(regexes.hebEngNumAndChar)]],
            licensePlate: [
                '',
                [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(8)],
            ],
            courthouse: [''],
            violationCodes: [''],
            violationDate: ['', [Validators.required]],
            violationTime: ['', [Validators.required]],
            vehicleMake: ['', [Validators.required]],
            modelType: [{ value: '', disabled: true }],
            amount: ['', [Validators.required, Validators.pattern('^[0-9]+.?[0-9]{0,2}$')]],
            currency: ['ILS'],
            city: ['', [Validators.required]],
            address: [{ value: '', disabled: true }, [Validators.required]],
            violationCity: ['', [Validators.required]],
            violationAddress: [{ value: '', disabled: true }, [Validators.required]],
            violationHouseNumber: ['', [Validators.pattern('[0-9]*')]],
            institutionName: ['RoadProtectIL'],
            ticketStatus: [0],
            transactionState: [0],
            ticketSystemName: ['RoadProtectIL'],
            israelIdNumber: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[0-9]*'),
                    Validators.minLength(5),
                    Validators.maxLength(9),
                    IdentityCardNumberValidator,
                ],
            ],
            hasMembership: [false],
            houseNumber: ['', [Validators.pattern('[0-9]*')]],
            paymentRefNumber: [''],
            finished: [false],
        });
    }

    private initializeUserInfoForm(): void {
        this.userInfo = this.fb.group({
            id: [-1],
            firstName: ['', [Validators.required, Validators.pattern('^([א-ת]*)$'), Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.pattern('^([א-ת]*)$'), Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            mobile: ['', []],
            phonePrefix: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
            additionalPhonePrefix: ['', [Validators.minLength(3), Validators.maxLength(3)]],
            additionalPhone: ['', [Validators.minLength(7), Validators.maxLength(7)]],
            city: ['', [Validators.required]],
            address: [
                {
                    value: '',
                    disabled: true,
                },
                [Validators.required],
            ],
            israelIdNumber: ['', [Validators.required, IdentityCardNumberValidator]],
            houseNumber: ['', [Validators.required]],
            allowMarketingContent: [true],
            tncAgreement: [false, [Validators.requiredTrue]],
            hasMembership: [false],
            country: ['IL'],
            finished: [false],
        });
    }

    private initializePaymentForm() {
        this.payment = this.fb.group({
            israelIdNumber: ['', [Validators.required, IdentityCardNumberValidator]],
            fullName: ['', [Validators.required, Validators.pattern('^([a-zA-Zא-ת ]*)$'), Validators.minLength(2)]],
            visaPart1: ['', [Validators.required, Validators.pattern('^([0-9]{4})$')]],
            visaPart2: ['', [Validators.required, Validators.pattern('^([0-9]{4})$')]],
            visaPart3: ['', [Validators.required, Validators.pattern('^([0-9]{4})$')]],
            visaPart4: ['', [Validators.required, Validators.pattern('^([0-9]{4})$')]],
            expirationMonth: ['', [Validators.required, Validators.pattern('^([0-9]{2})$')]],
            expirationYear: ['', [Validators.required, , Validators.pattern('^([0-9]{2})$')]],
            cvv: ['', [Validators.required]],
        });
    }

    public restartProcess(): void {
        this.initializeFineDetailsForm();
        this.initializePaymentForm();
        this.userInfo.get('finished').setValue(false);
        this.violation = null;
        this.appealPaths = [];
        this.pics = [];
        this.idPic = null;
    }

    private initializeForms(): void {
        this.initializeFineDetailsForm();
        this.initializePaymentForm();
        this.initializeUserInfoForm();
        this.pics = [];
        this.idPic = null;
    }

    public routeToEnd(): boolean {
        return (
            this.fine.get('finished').value &&
            this.appealPaths.length > 0 &&
            this.pics.filter(document => document.typeCode === '1060').length > 0 &&
            this.userInfo.get('finished').value &&
            !!this.idPic
        );
    }

    public updateTicket(ticket: TicketModel): void {
        this.fine.patchValue({
            israelIdNumber: '',
            licensePlate: '',
            violationTime: '',
            houseNumber: '',
            ...ticket,
        });
        if (ticket.violationDate) {
            const [date, time] = ticket.violationDate.split(' ');
            if (date && time) {
                this.fine.get('violationDate').patchValue(date);
                const [h, m, _] = time.split(':');
                this.fine.get('violationTime').patchValue(`${h}:${m}`);
            }
        }
        if (ticket.city) {
            this.fine.get('address').enable();
            if (ticket.address) {
                const [street, houseNumber] = ticket.address.split('_');
                if (street) {
                    this.fine.get('address').patchValue(street);
                }
                if (houseNumber) {
                    this.fine.get('houseNumber').patchValue(houseNumber);
                }
            }
        }
        if (ticket.violationCity) {
            this.fine.get('violationAddress').enable();
            if (ticket.address) {
                const [violationStreet, violationHouseNumber] = ticket.violationAddress.split('_');
                if (violationStreet) {
                    this.fine.get('violationAddress').patchValue(violationStreet);
                }
                if (violationHouseNumber) {
                    this.fine.get('violationHouseNumber').patchValue(violationHouseNumber);
                }
            }
        }
        if (ticket.vehicleMake && ticket.vehicleMake !== '') {
            this.fine.get('modelType').enable();
            this.fine.get('modelType').patchValue(ticket.modelType);
        }
        this.violation = this.violationsData.find(data => data.id === ticket.violationCodes);
    }

    public get paragraphIds(): string[] {
        const rawParagraphArray = [...new Set(this.appealPaths.map((path: Array<string>) => path[path.length - 1]))];
        const ids = [];
        rawParagraphArray.forEach(res => {
            if (res.includes(',')) {
                const splitted = res.split(',');
                splitted.forEach(para => ids.push(para));
            } else {
                ids.push(res);
            }
        });
        return [...new Set(ids)];
    }
}
