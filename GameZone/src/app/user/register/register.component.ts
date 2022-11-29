import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.modal';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    constructor(private auth: AuthService, private emailTaken: EmailTaken){
      
    }

  inSubmission = false;
  showAlert = false;
  alertMessage = 'Please wait your account is being created.';
  alertColor = 'blue';

  registerForm = new FormGroup({

    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ],this.emailTaken.validate),
    age: new FormControl<number | null>(null, [
      Validators.min(15),
      Validators.max(120)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    ]),
    confirm_password: new FormControl('', [
      Validators.required
    ])
  }, RegisterValidators.match('password', 'confirm_password')); // --> Angular will automaticlly invoke this func with the formGorup 

  async register() {

    this.showAlert = true;
    this.alertMessage = 'Please wait your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

  

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    } catch (e) {
      console.error(e);

      this.alertMessage = 'An unexpected error occurred. Please try again later.';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMessage =  'Success! Your account has been created.'
    this.alertColor = 'green';
  }
}
