import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private basePath: any;
  private userInfo: any = '/userInfo';

  constructor(private storage: AngularFireStorage, private fs: AngularFirestore) { }


  pushFileToStorage(fileUpload: FileUpload, imagePath: string, userId: string) {
    if (imagePath.length == 1) {
      if (imagePath == 'P')
        this.basePath = '/profilePath';
      else
        this.basePath = '/listingsPath';
    }

    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        const url = storageRef.getDownloadURL();
        url.subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          console.log(downloadURL);
          console.log(userId);
          this.saveFileData(fileUpload, userId);
        });
      })
    ).subscribe();


  }

  private saveFileData(fileUpload: FileUpload, userId: string): void {
    console.log(this.userInfo);
    console.log(userId);


    this.fs.collection(this.userInfo).doc(userId).set({ imageUrl: fileUpload.url }, { merge: true }).then(res => {
      console.log(res);
    }).catch(error => {
      console.log("error: " + error);
    })
  }
  //this.db.list(this.basePath).push(fileUpload);


  // getFiles(numberItems: number): AngularFireList<FileUpload> {
  //   return this.db.list(this.basePath, ref =>
  //     ref.limitToLast(numberItems));
  // }

  // deleteFile(fileUpload: FileUpload): void {
  //   this.deleteFileDatabase(fileUpload.key)
  //     .then(() => {
  //       this.deleteFileStorage(fileUpload.name);
  //     })
  //     .catch(error => console.log(error));
  // }

  // private deleteFileDatabase(key: string): Promise<void> {
  //   return this.db.list(this.basePath).remove(key);
  // }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
