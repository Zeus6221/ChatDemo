import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Router } from '@angular/router';
import { RequestsService } from '../services/requests.service';
import { FrienshipRequest } from '../interfaces/Request';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  query: string;
  friends: User[];
  closeResult: string;
  friendEmail: string;
  user: User;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private requestService: RequestsService,
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
    this.asignarUsuario();
  }

  asignarUsuario() {
    this.authenticationService.getStatus()
      .subscribe(
        response => {
          this.userService.getUserById(response.uid)
            .valueChanges()
            .subscribe(
              (data: User) => {
                this.user = data;
                if (this.user.Friends) {
                  this.user.Friends = Object.values(this.user.Friends);

                }
              },
              getuserError => { console.log(getuserError); }
            );
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

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sendRequest() {
    const request: FrienshipRequest = {
      Timestamp: Date.now(),
      Receiver_email: this.friendEmail,
      Sender: this.friendEmail,
      SenderId: this.user.Uid,
      Status: 'pending'
    }

    this.requestService.createRequest(request)
      .then(
        () => {
          alert('Solicitud enviada');
        }
      )
      .catch(error => { console.log(error); });
  }
}