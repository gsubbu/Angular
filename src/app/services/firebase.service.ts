import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn: boolean = false;
  userId: any;
  errorMessage: string = '';
  showButton: boolean = false;


  constructor(public firebaseAuth: AngularFireAuth, private router: Router) { }

  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        this.isLoggedIn = true;
        //set user id on sign in
        this.userId = res.user?.uid;
        this.showButton = true;
        localStorage.setItem('user', JSON.stringify(res.user))
      }, err => {
        console.log("Invalid email address/passsword");
        this.isLoggedIn = false;
      });
  }

  async signup(email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.isLoggedIn = true;
        //set user id on sign up
        this.userId = res.user?.uid;
      })
  }

  logout() {
    this.firebaseAuth.signOut();
    //remove user from local storage
    localStorage.removeItem('user');
    //reset values for userId & isLoggedin
    this.userId = '';
    this.isLoggedIn = false;
    //redirect to home
    this.router.navigate(['home']);
  }
}
