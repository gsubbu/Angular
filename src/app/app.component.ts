import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, AfterViewChecked {
  title = 'StockTradeApplication';

  constructor(private firebaseAuth: FirebaseService, private userService: UserService, private router: Router) {
    if(this.router.getCurrentNavigation()?.extras.skipLocationChange){
      this.showButton = true;
      console.log("works");
    }
    console.log("cons")
    this.checkUserSession();
  }
  userName: string = ', User';
  showButton: boolean = false;

  ngOnInit() {

  }

  ngAfterViewInit(){
    console.log("viewInit");
  }

  ngAfterViewChecked(){
   // this.checkUserSession();
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
    console.log("called")
    this.showButton = false;

    if (localStorage.getItem('user') != null) {
      this.userService.getUsersById(this.firebaseAuth.userId).subscribe(
        (res: any) => {
          let data = res.data();
          //display signed in user name
          this.userName = ' ' + data.fullName;
          this.showButton = this.firebaseAuth.showButton;
          console.log(typeof data)
          console.log(res.data());
        }
      )
    }
  }


}
