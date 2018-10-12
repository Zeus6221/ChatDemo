import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interfaces/user';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  loginWhitEmail(user: User) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(user.Email, user.Password);
  }

  registerWhitEmail(user: User) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(user.Email, user.Password);
  }

  getStatus() {
    return this.angularFireAuth.authState;
  }

  logout() {
    return this.angularFireAuth.auth.signOut();
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.angularFireAuth.auth.signInWithPopup(provider);
  }
}
