import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  query: string;
  friends: User[];
  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router) { }
  ngOnInit() {
    this.userService.getUsers()
      .valueChanges()
      .subscribe(
        (response) => {
          if (response) {
            this.friends = <User[]>response;
          }
        },
        error => {
          console.log(error);
        }
      );
  }
  logout() {
    this.authenticationService.logout()
      .then(
        () => {
          alert("sesion cerrada");
          this.router.navigate(['login']);
        }
      )
      .catch(exception => { console.log(exception); });
  }
}