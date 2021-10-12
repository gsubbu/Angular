import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFirestore: AngularFirestore) { }


  getUsers() {
    return this.angularFirestore.collection("userInfo").snapshotChanges();
  }

  getUsersById(userId: any) {
    return this.angularFirestore.collection("userInfo").doc(userId).get();
  }

  createUser(user: any) {
    return new Promise<any>((resolve, reject) => {
      this.angularFirestore
        .collection("userInfo")
        .add(user)
        .then(response => { resolve(response) }, error => reject(error));
    });


  }
}
