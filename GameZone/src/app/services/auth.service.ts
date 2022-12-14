import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore/'; 
import { Observable, of } from 'rxjs';
import IUser from '../models/user.modal';
import { delay, filter, map, switchMap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>;  // reference - more readably and Type safety
  public isAuthenticated$: Observable<boolean>; //Identifying properties as observable
  public isAuthenticatedWithDelay$:Observable<boolean>;
  private redirect = false;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore,
               private router: Router, private route: ActivatedRoute) {

    //Create a collection of users in the database
    this.userCollection = db.collection('users');
    //Current authentication status
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1400)
    );

    this.router.events
    .pipe(filter(e => e instanceof NavigationEnd),
     map(e => this.route.firstChild),
     switchMap(route => route?.data ?? of({}))
    ).subscribe(data =>{
      this.redirect = data['authOnly'] ?? false
    }); 

  }

  // Create user with given data from the registerform
  public async createUser(userData:IUser){

    //Cheking if a password was given
    if(!userData.password){
      throw new Error('Password not provided!');   
    }

    //Firebase authenticate the user
    const userCredentions = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    );

    //Checking if the user property is null
    if(!userCredentions.user){
      throw new Error("User can't be found");
      
    }

    // Type safety
    // If doc with given ID doesn't exist will be created and will return document
    await this.userCollection.doc(userCredentions.user.uid).set({ 
      name: userData.name,
      email: userData.email,
      age: userData.age
    });
    
    // Update user profile name
    await userCredentions.user.updateProfile({
      displayName: userData.name
    });
  }

  public async logout($event?: Event){

    if($event){
      $event.preventDefault();
    }
    
    await this.auth.signOut();

    if(this.redirect){
      await this.router.navigateByUrl('/');
    } 
  }
}
