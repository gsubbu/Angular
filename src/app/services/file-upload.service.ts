import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private imageStoragePath: string = '';
  private collectionPath: string = '';
  

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) {
  }


  pushFileToStorage(fileUpload: FileUpload, imagePath: string, userId: string) {
    if (imagePath !== null && imagePath.length == 1) {
      if (imagePath == 'P') this.imageStoragePath = '/profilePictures'; else this.imageStoragePath = '/listingPictures';
    }

    const filePath = `${this.imageStoragePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        const url = storageRef.getDownloadURL();
        url.subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          console.log(downloadURL);
          console.log(userId);
          if (imagePath == 'P') this.collectionPath = '/usersInfo'; else this.collectionPath = '/listingsInfo';
          this.saveFileData(fileUpload, userId, this.collectionPath);
        });
      })
    ).subscribe();


  }

  private saveFileData(fileUpload: FileUpload, documentId: string, collectionPath: string): void {    
    console.log(documentId);

    this.firestore.collection(collectionPath).doc(documentId).set({ imageUrl: fileUpload.url }, { merge: true }).then(res => {
      console.log(res);
    }).catch(error => {
      console.log("error: " + error);
    })
  }

}
