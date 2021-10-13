import { Injectable } from '@angular/core';
import { AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(private firestore: AngularFirestore) { }

  listings!: AngularFireList<any>;


  getListings() {
    return this.firestore.collection("listingsInfo").snapshotChanges();
  }

  createListings(data: any) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection("listingsInfo")
        .add(data)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }
}
