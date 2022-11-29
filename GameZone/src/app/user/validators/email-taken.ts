import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from "@angular/core";

// This decorator will allow the class to be injected with services
@Injectable({
    providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {

    constructor(private auth: AngularFireAuth) { }

    validate = (control: AbstractControl): Promise<ValidationErrors | null> => {
        // Firebase function to check if the E-Mail exist / If the E-Mail does not exist, Firebasi will return an empty array
        return this.auth.fetchSignInMethodsForEmail(control.value).then(
            response => response.length ? { emailTaken: true } : null
        );
    }
}
