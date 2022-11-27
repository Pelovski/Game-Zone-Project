import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore/'; 
import { Observable } from 'rxjs';
import IUser from '../models/user.modal';
import { map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
  }

  public async createUser(userData:IUser){

    if(!userData.password){
      throw new Error('Password not provided!');   
    }
    const userCredentions = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    );

    if(!userCredentions.user){
      throw new Error("User can't be found");
      
    }

    await this.userCollection.doc(userCredentions.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age
    });
    
    await userCredentions.user.updateProfile({
      displayName: userData.name
    });
  }
}
