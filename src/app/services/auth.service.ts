import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireStore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.angularFireStore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);  // 空のObservableを返す
        }
      })
    );
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.angularFireAuth.signOut();
    this.router.navigate(['/']);
  }

  private updateUserData(user: User) {
    // ログイン痔にfirestoreにuser dataを追加する
    const userRef: AngularFirestoreDocument<User> = this.angularFireStore.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data, { merge: true })
  }
}
