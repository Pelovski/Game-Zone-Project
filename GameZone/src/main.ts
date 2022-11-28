import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'

if (environment.production) {
  enableProdMode();
}

//Initialize Firebase first
firebase.initializeApp(environment.firebase);

let appInit = false;

//Calling this funktion to gain access to the auth methods, with is where we can listen for the event
//Firebase will emmit an event whenever the user's auth sate changes. (Login / Logout)
firebase.auth().onAuthStateChanged(() => {

  // Check if we have alredy Initialize Angular
  if (!appInit) {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  }

  appInit = true;
});