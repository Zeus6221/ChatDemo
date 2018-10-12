import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Conversation } from '../interfaces/conversation';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private angularfirebaseDatabase: AngularFireDatabase) { }

  createConversation(conversation: Conversation) {
    return this.angularfirebaseDatabase
      .object('conversations/' + conversation.Uid + '/' + conversation.Timestamp)
      .set(conversation);
  }
  sendZumbido(conversation: Conversation) {
    return this.angularfirebaseDatabase
      .object('conversations/' + conversation.Uid + '/' + 1)
      .update(conversation);
  }
  editConversation(conversation: Conversation) {
    return this.angularfirebaseDatabase
      .object('conversations/' + conversation.Uid + '/' + conversation.Timestamp)
      .update(conversation);
  }
  getConversation(uid) {
    return this.angularfirebaseDatabase.list('conversations/' + uid);
  }
}
