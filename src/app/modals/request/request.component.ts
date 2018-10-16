import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/services/user.service';
import { RequestsService } from 'src/app/services/requests.service';
import { FrienshipRequest } from 'src/app/interfaces/Request';
import { User } from 'src/app/interfaces/user';


export interface PromptModel {
  scope: any;
  currentRequest: FrienshipRequest;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel, OnInit {
  scope: any;
  currentRequest: FrienshipRequest = <FrienshipRequest>{ Status: "acepted" };
  senderUser: User;

  constructor(
    public dialogService: DialogService,
    private userService: UserService,
    private requestService: RequestsService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.userService.getUserById(this.currentRequest.SenderId)
      .valueChanges()
      .subscribe(
        (senderUser: User) => {
          this.senderUser = senderUser;
        }
      )
  }
  confirm() {
    this.requestService.setRequestStatus(this.currentRequest)
      .then(() => {
        if (this.currentRequest.Status == "acepted") {
          this.userService.addFriend(this.scope.user.Uid, this.currentRequest.SenderId)
            .then(() => { alert("solicitud aceptada con exito"); })
          this.close();
        }
      })
      .catch(error => { console.log(error); });
  }
}
