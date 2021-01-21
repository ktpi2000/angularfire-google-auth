import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
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
    )
  }
}
