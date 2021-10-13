import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],  
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  isSignedIn = false;

  constructor(public firebaseService: FirebaseService, public router: Router) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  getEmail() { return this.loginForm.controls['email'].value };
  getPassword() { return this.loginForm.controls['password'].value };

  ngOnInit(): void {
    if (localStorage.getItem('user') !== null)
      this.isSignedIn = true;
    else
      this.isSignedIn = false;
  }

  async login() {
    await this.firebaseService.signin(this.getEmail(), this.getPassword());
    console.log("about to log");
    if (this.firebaseService.isLoggedIn) {
      console.log("logged")
      this.isSignedIn = true;
      this.router.navigate(['/listings']);
    }

  }

}
