import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }


  getUsers() {
    return this.firestore.collection("usersInfo").snapshotChanges();
  }

  getUsersById(userId: any) {
    return this.firestore.collection("usersInfo").doc(userId).get();
  }

  createUser(user: any) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("usersInfo")
        .add(user)
        .then(response => { resolve(response) }, error => reject(error));
    });


  }
}
