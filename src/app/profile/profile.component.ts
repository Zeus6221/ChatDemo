import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { ImageCroppedEvent } from 'ngx-image-cropper/src/image-cropper.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;

  constructor(
    private userService: UserService,
    private autenticationService: AuthenticationService,
    private firebaseStorage: AngularFireStorage) { }

  ngOnInit() {
    this.autenticationService.getStatus()
      .subscribe(
        response => {
          this.userService.getUserById(response.uid)
            .valueChanges()
            .subscribe(
              (data: User) => {
                this.user = data;
              },
              getuserError => { console.log(getuserError); }
            );
        },
        error => {
          console.log(error);
        }
      );
  }

  saveSettings() {
    if (this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage
        .ref('/pictures/' + currentPictureId + '.jpg')
        .putString(this.croppedImage, 'data_url');

      pictures.then(
        result => {
          this.picture = this.firebaseStorage.ref('/pictures/' + currentPictureId + '.jpg')
            .getDownloadURL();

          this.picture.subscribe(
            pictureUrl => {
              this.user.Avatar = pictureUrl;
              this.userService.setAvatar(this.user)
                .then(
                  () => {
                    alert("subido correctamente");
                  }
                ).
                catch(error => { console.log("error al intentar subir la imagen: " + error); });
            }
          );
        }
      ).catch(error => { console.log(error); });


    }
    else {
      this.userService.editUser(this.user)
        .then(
          () => {
            alert("cambios realizados");
          }
        )
        .catch(
          error => { console.log(error); }
        );
    }
  }

  fileChangeEvent(event: any): void {
    console.log("hola mundo");
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    console.log(event.base64);
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
}