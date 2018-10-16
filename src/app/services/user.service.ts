import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  Friends: User[];

  constructor(
    private angularFirestoreDatabase: AngularFireDatabase) {

  }
  add(user: User) {
    return this.angularFirestoreDatabase.object('/users/' + user.Uid).set(user);
  }
  editUser(user: User) {
    return this.angularFirestoreDatabase.object('/users/' + user.Uid).update(user);
  }
  getUsers() {
    return this.angularFirestoreDatabase.list('/users');
  }
  getUserById(id) {
    return this.angularFirestoreDatabase.object('/users/' + id);
  }
  setAvatar(user: User) {
    return this.angularFirestoreDatabase
      .object('/users/' + user.Uid + '/Avatar')
      .set(user.Avatar);
  }
  addFriend(userId, friendId) {
    this.angularFirestoreDatabase.object('users/' + userId + '/Friends/' + friendId).set(friendId);
    return this.angularFirestoreDatabase.object('users/' + friendId + '/Friends/' + userId).set(userId);
  }
}