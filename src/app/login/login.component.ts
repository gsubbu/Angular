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
  isSignedIn = true;
 

  constructor(public firebaseService: FirebaseService, public router: Router) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  getEmail() { return this.loginForm.controls['email'].value };
  getPassword() { return this.loginForm.controls['password'].value };

  ngOnInit(): void {
    console.log(this.firebaseService.isLoggedIn)
  }

  async login() {
    if (this.loginForm.valid) {

      await this.firebaseService.signin(this.getEmail(), this.getPassword());

      //display error message for invalid credentials
      this.isSignedIn = this.firebaseService.isLoggedIn;

     
      if (this.firebaseService.isLoggedIn) {
                    
        this.router.navigate(['listings']);
      }
    }
  }

}


