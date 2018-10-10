import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  friends: User[];

  constructor() {

    let usuario1: User = {
      nick: 'Eduardo',
      age: 24,
      email: 'ed@aoe.aoe',
      friend: true,
      uid: 1
    };
    let usuario2: User = {
      nick: 'Freddy',
      age: 28,
      email: 'fred@aoe.aoe',
      friend: true,
      uid: 1
    };
    let usuario3: User = {
      nick: 'Yuliana',
      age: 18,
      email: 'yuli@aoe.aoe',
      friend: true,
      uid: 1
    };
    let usuario4: User = {
      nick: 'Ricardo',
      age: 17,
      email: 'rick@aoe.aoe',
      friend: false,
      uid: 1
    };
    let usuario5: User = {
      nick: 'Marcos',
      age: 30,
      email: 'marcos@aoe.aoe',
      friend: false,
      uid: 1
    };

    let usuario6: User = {
      nick: 'Maria',
      age: 30,
      email: 'Maria@aoe.aoe',
      friend: false,
      uid: 1
    };

    this.friends = [usuario1, usuario2, usuario3, usuario4, usuario5, usuario6];
  }

  getFriends() {
    return this.friends;
  }

  getFriendById(id): User {
    return this.friends.find(friend => friend.uid = id);
  }
}
