import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFirestore: AngularFirestore) { }


  createUser(user: any) {
    return new Promise<any>((resolve, reject) =>{
      this.angularFirestore
        .collection("userInfo")
        .add(user)
        .then(response => { console.log(response) }, error => reject(error));
    });
  }
}
