import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { Status } from '../interfaces/status.enum';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation: string = "login";
  user: User = <User>{};

  constructor(
    private autenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.autenticationService.loginWhitEmail(this.user)
      .then(response => {
        this.router.navigate(['home'])
      })
      .catch(error => console.log("ha ocurrido un error" + error));
  }

  register() {
    this.autenticationService.registerWhitEmail(this.user)
      .then(response => {
        this.user.Uid = response.user.uid;
        this.userService.add(this.user)
          .then(data => { console.log(data); })
          .catch(error => { console.log(error) });
        ;

      })
      .catch(error => console.log("ha ocurrido un error" + error));
  }
  loginWithFacebook() {
    this.autenticationService.facebookLogin()
      .then(response => {
        if (response.additionalUserInfo.isNewUser) {
          const user: User = {
            Email: response.user.email,
            Uid: response.user.uid,
            Nick: response.user.displayName,
            Avatar: response.user.photoURL,
            active: true,
            status: Status.Online
          }
          this.userService.add(user);
        }
        this.router.navigate(['home']);
      }
      )
      .catch(error => { console.log(error); })
  }
}
