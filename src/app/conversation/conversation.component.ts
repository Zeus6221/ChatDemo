import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { Conversation } from '../interfaces/conversation';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileMessage } from '../interfaces/file-message';
import { ThrowStmt } from '@angular/compiler';

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

    this.SendFile();
    this.conversationService.createConversation(this.message)
      .then(
        () => {
          this.message.TextMessage = "";
          this.message.AttachFile = null;
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

  fileChangeEvent(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.attachedFile(event.target.files[0]);
    }
  }

  private attachedFile(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let attachedFile: FileMessage =
      {
        MimeType: file.type,
        FileBase64: reader.result.toString(),
        FileName: file.name,
        FileId: Date.now() + file.name
      }
      if (!this.message.AttachFile) {
        this.message.AttachFile = new Array<FileMessage>();
      }
      this.message.AttachFile.push(attachedFile);
    };
  }

  private SendFile() {
    let me = this;
    if (this.message.AttachFile && this.message.AttachFile.length > 0) {
      this.message.AttachFile.forEach(
        (attached, index, array) => {
          const currentPictureId = Date.now();
          const files = this.firebaseStorage.ref('/files/' + currentPictureId + attached.FileName)
            .putString(attached.FileBase64, 'data_url');

          files.then(result => {
            let aux = this.firebaseStorage.ref('/files/' + currentPictureId + attached.FileName)
              .getDownloadURL();

            aux.subscribe(documentUrl => {
              array[index].FileBase64 = null;
              array[index].FileUrl = documentUrl;
              console.log(me.message.AttachFile[index]);
            });
          })
            .catch(error => { console.log(error); });
        })
    }
  }

  removeFile(file) {
    let index = this.message.AttachFile.indexOf(file);
    this.message.AttachFile.splice(index, 1);
  }
}
