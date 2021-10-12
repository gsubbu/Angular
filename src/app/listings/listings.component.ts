import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from '../models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { ListingService } from '../services/listing.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {

  post: boolean = false;
  view: boolean = false;

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  listImage: any;
  fileAttr: any;

  postListingsForm: FormGroup = new FormGroup({
    fileName: new FormControl(),
    cost: new FormControl(0, [Validators.required,Validators.min(0)]),
    dimensions: new FormControl('', [Validators.required]),
    fileType: new FormControl('', [Validators.required]),
    tag: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category: new FormControl('', [Validators.required])
  })

  getFileName() { return this.postListingsForm.controls['fileName'].value }
  getCost() { return this.postListingsForm.controls['cost'].value }
  getdimensions() { return this.postListingsForm.controls['dimensions'].value }
  getFileType() { return this.postListingsForm.controls['fileType'].value }
  getTag() { return this.postListingsForm.controls['tag'].value }
  getcategory() { return this.postListingsForm.controls['category'].value }

  updateFileName(value: any) { this.postListingsForm.patchValue({ fileName: value }); }
  updateFileType(value: any) { this.postListingsForm.patchValue({ fileType: value }); }

  categories: string[] = ["Health", "Energy", "Industry", "Utilities"];

  constructor(private uploadService: FileUploadService, private listingService: ListingService) { }

  @ViewChild('fileInput')
  fileInput!: ElementRef;

  ngOnInit(): void {
  }

  postToMarketplace() {
    this.post = true;
    this.view = false;
  }

  viewMarketplace() {
    this.view = true;
    this.post = false;
  }

  selectImage(event: any) {
    //get file
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      //display image name
      this.updateFileName(this.selectedFiles[0].name);

      //read the extension of the image
      this.updateFileType(this.selectedFiles[0].name.split('.').pop());

      //preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.listImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedFiles[0]);
    }

  }

  uploadPicture(): void {

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        // this.uploadService.pushFileToStorage(this.currentFileUpload, 'I');

        // .subscribe(
        //   error => {
        //     console.log(error);
        //   }
        // );
      }
    }

  }

  postListings() {
    // this.uploadPicture();

    if (this.postListingsForm.valid) {
      let today = new Date();

      let listingData = {
        imageId: '',
        imageName: this.getFileName(),
        cost: this.getCost(),
        dimensions: this.getdimensions(),
        fileType: this.getFileType(),
        tags: this.getTag(),
        category: this.getcategory(),
        datePosted: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),

      }

      this.listingService.postListings(listingData).then(res => {
        console.log(res);
      });
    }
  }

  resetForm() {

    //reset form
    this.postListingsForm.reset();
    //clear image
    this.fileInput.nativeElement.value = '';
    this.listImage = '';
  }



}
