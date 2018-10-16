import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FrienshipRequest } from '../interfaces/Request';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  createRequest(request: FrienshipRequest) {
    const cleanEmail = request.Receiver_email.replace('.', ',');
    return this.angularFireDatabase
      .object('requests/' + cleanEmail + '/' + request.SenderId)
      .set(request);
  }

  setRequestStatus(request: FrienshipRequest) {
    const cleanEmail = request.Receiver_email.replace('.', ',');
    return this.angularFireDatabase
      .object('requests/' + cleanEmail + '/' + request.SenderId)
      .update(request);
  }

  getRequestsForEmail(email) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.list('requests/' + cleanEmail)
  }
}
