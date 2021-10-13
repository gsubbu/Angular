import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private userService: UserService, private firebaseAuth:FirebaseService) {

   }

  ngOnInit(): void {
  }


  loginUser() {    
    //redirect to listings if user is logged in
    if (localStorage.getItem('user') != null) {
      console.log(this.firebaseAuth.userId);
      this.userService.getUsersById(this.firebaseAuth.userId).subscribe(
        res=>{
          console.log(res.data());          
        }
      )
        this.router.navigate(['listings']);
    }
    else
      this.router.navigate(['login']);
  }

  registerUser() {
    this.router.navigate(['register']);
  }

}
