import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ContactUsService } from '../../../../core/services/contact-us.service';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
    formGroup: FormGroup;
    phonePrefixArray = ['050', '051', '052', '053', '054', '055', '056', '058', '059'];

    constructor(
        private fb: FormBuilder,
        private contactUsService: ContactUsService,
        private snackBar: MatSnackBar,
        private router: Router,
    ) {}

    ngOnInit() {
        this.formGroup = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phonePrefix: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
            message: new FormControl(''),
        });
    }

    onSubmit() {
        const data = this.formGroup.value;
        data.mobile = `${data.phonePrefix}${data.phone}`;
        this.contactUsService
            .submitContactForm(data)
            .then(result => {
                if (result === true) {
                    this.snackBar.open(`נהיה בקשר בקרוב.`, `הצלחה!`, {
                        panelClass: 'success-snackbar',
                        duration: 3000,
                    });
                }
            })
            .catch(error => {
                this.snackBar.open(`משהו השתבש`, `שגיאה`, {
                    panelClass: 'error-snackbar',
                    duration: 3000,
                });
            });
    }

    public get isFormValid() {
        return (
            this.formGroup.get('name').valid &&
            this.formGroup.get('phone').valid &&
            this.formGroup.get('email').valid &&
            this.formGroup.get('message').valid &&
            this.formGroup.get('phonePrefix').valid
        );
    }
}
