import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Conversation } from '../interfaces/conversation';
import { ConversationService } from '../services/conversation-service.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  friendId: any;
  friend: User;
  user: User;
  message: Conversation = <Conversation>{};
  conversation: Conversation[];
  shake: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    private authenticationService: AuthenticationService,
    private firebaseStorage: AngularFireStorage) {
    this.friendId = activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.authenticationService.getStatus()
      .subscribe(
        session => {
          this.userService.getUserById(session.uid)
            .valueChanges()
            .subscribe(
              (user: User) => {
                this.user = user;

                this.userService.getUserById(this.friendId)
                  .valueChanges().subscribe(
                    response => {
                      this.friend = <User>response;
                      let ids = [this.user.Uid, this.friend.Uid].sort();
                      this.message.Uid = ids.join('|');
                      this.message.Sender = this.user.Uid;
                      this.message.Receiver = this.friend.Uid;

                      this.getConversations();
                    }
                  );
              }
            );
        }
      );
  }

  sendMessage() {
    this.message.Timestamp = Date.now();
    this.message.Type = "text";

    this.conversationService.createConversation(this.message)
      .then(
        () => {
          this.message.TextMessage = "";
        }
      )
      .catch(error => {
        console.log(error);
      });
  }

  sendZumbido() {
    console.log("zumbido");
    this.message.Timestamp = Date.now();
    this.message.Type = "zumbido";
    this.message.Seen = false;
    this.conversationService.sendZumbido(this.message)
      .then(
        () => {
          this.doZumbido();
        }
      )
      .catch(error => {
        console.log(error);
      });
  }

  doZumbido(): any {
    const audio = new Audio('../../assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(() => { this.shake = false; }, 1000);
  }

  getConversations() {
    this.conversationService.getConversation(this.message.Uid)
      .valueChanges()
      .subscribe(
        (response: Conversation[]) => {
          this.conversation = response;
          this.conversation.forEach(currentMessage => {
            if (!currentMessage.Seen) {
              currentMessage.Seen = true;
              if (currentMessage.Type == "text") {
                this.conversationService.editConversation(currentMessage);
                const audio = new Audio('../../assets/sound/new_message.m4a');
                audio.play();
              }
              else if (currentMessage.Type == "zumbido") {
                this.conversationService.sendZumbido(currentMessage);
                this.doZumbido();
              }
            }
          })
        },
        error => {
          console.log(error);
        }
      );
  }

  getUserNickById(senderId) {
    if (senderId == this.friend.Uid) {
      return this.friend.Nick;
    }
    else {
      return this.user.Nick;
    }

  }
}