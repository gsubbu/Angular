import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';

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


  constructor(private uploadService: FileUploadService, private userService: UserService,
    private notificationService: NotificationService) { }

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
  }


  selectImage(event: any) {
    //get file
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {

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

  registerUser() {
    if (this.profileForm.valid) {
      //this.uploadPicture();

      this.userService.createUser(this.profileForm.value).then(res => {
        console.log(res);
      });
      this.notificationService.success(this.getFullName().toUppercase() + " registered successfully");
      this.resetForm();
    }

  }

  uploadPicture(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload, 'P').subscribe(
          error => {
            console.log(error);
          }
        );
      }
    }

  }

  resetForm() {
    this.profileForm.reset();
    //clear image
    this.fileInput.nativeElement.value = '';
    this.profileImg = '';
  }

}
