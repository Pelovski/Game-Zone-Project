import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore/'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {

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
    ]),
    age: new FormControl('', [
      Validators.min(15),
      Validators.max(120)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    ]),
    confirm_password: new FormControl('', [
      Validators.required
    ]),
  });

  async register() {

    this.showAlert = true;
    this.alertMessage = 'Please wait your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    const { email, password } = this.registerForm.value

    try {
      const userCredentions = await this.auth.createUserWithEmailAndPassword(
        email as string, password as string
      );

      await this.db.collection('users').add({
        name: this.registerForm.controls['name'].value,
        email: this.registerForm.controls['email'].value,
        age: this.registerForm.controls['age'].value
      });

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
