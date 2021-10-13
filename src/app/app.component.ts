import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'StockTradeApplication';

  constructor(private firebaseAuth: FirebaseService, private userService: UserService, private router: Router) {    
    this.checkUserSession();
  }
  userName: string = ', User';
  showButton: boolean = false;

  ngOnInit() {

  }

  logout() {
    this.firebaseAuth.logout();
    this.showButton = false;
  }

  home() {
    this.checkUserSession();
    this.router.navigate(['home']);
  }

  checkUserSession() {
    this.showButton = false;

    if (localStorage.getItem('user') != null) {
      this.userService.getUsersById(this.firebaseAuth.userId).subscribe(
        (res: any) => {
          let data = res.data();
          //display signed in user name
          this.userName = ' ' + data.fullName;
          this.showButton = this.firebaseAuth.showButton;
        }
      )
    }
  }


}
