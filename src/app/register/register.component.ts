import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide: boolean = true;

  profileForm: FormGroup = new FormGroup({
    fileName: new FormControl(),
    fullName: new FormControl('', [Validators.required]),
    webSiteUrl: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    imageUrl: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  getFileName() { return this.profileForm.controls['fileName'].value }
  getFullName() { return this.profileForm.controls['fullName'].value }
  getWebSiteUrl() { return this.profileForm.controls['webSiteUrl'].value }
  getEmail() { return this.profileForm.controls['email'].value }
  getPassword() { return this.profileForm.controls['password'].value }

  updateFileName(value: any) { this.profileForm.patchValue({ fileName: value }) };

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;

  profileImg: any;
  img: any;

  isSignedIn = false;

  constructor(private uploadService: FileUploadService, private userService: UserService,
    private notificationService: NotificationService, public firebaseService: FirebaseService, private router:Router) { }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {

    // this.userService.getUsersById('EiTmxq43W3HQfZcis9dR').subscribe(
    //   res => {
    //     console.log(res.data())
    //     var x: any = res.data();
    //     this.img = x.imageUrl;
    //   });      

  }


  selectImage(event: any) {
    //get file
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      //check if image is selected
      if (this.selectedFiles[0].type.split('/')[0] !== "image") {
        console.error('unsupported file type :( ')
        return;
      }

      //display image name
      this.updateFileName(this.selectedFiles[0].name)

      //preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImg = e.target.result;
      };
      reader.readAsDataURL(this.selectedFiles[0]);
    }

  }

  async registerUser() {
    if (this.profileForm.valid) {

      await this.firebaseService.signup(this.getEmail(), this.getPassword())
      if (this.firebaseService.isLoggedIn) {        
        
        this.userService.createUser(this.profileForm.value,this.firebaseService.userId).then(res => {
          
          this.uploadPicture(this.firebaseService.userId);
          
          this.notificationService.success(this.getFullName() + " registered successfully");
          this.resetForm();
          this.router.navigate(['home']);
        })
      }
    }

  }

  uploadPicture(userId: any): void {
   
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload, 'P', userId);
      }
    }

  }

  resetForm() {
    this.profileForm.reset();
    //clear image
    this.fileInput.nativeElement.value = '';
    
  }

}
