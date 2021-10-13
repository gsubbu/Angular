import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from '../models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { ListingService } from '../services/listing.service';
import { NotificationService } from '../services/notification.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ListingsComponent implements OnInit {

  post: boolean = false;
  view: boolean = false;

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  listImage: any;
  fileAttr: any;

  postListingsForm: FormGroup = new FormGroup({
    imageName: new FormControl(),
    imageUrl: new FormControl(),
    cost: new FormControl(0, [Validators.required, Validators.min(0)]),
    dimensions: new FormControl('', [Validators.required]),
    imageType: new FormControl('', [Validators.required]),
    tag: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category: new FormControl('', [Validators.required])
  })

  getImageName() { return this.postListingsForm.controls['imageName'].value }
  getCost() { return this.postListingsForm.controls['cost'].value }
  getdimensions() { return this.postListingsForm.controls['dimensions'].value }
  getImageType() { return this.postListingsForm.controls['imageType'].value }
  getTag() { return this.postListingsForm.controls['tag'].value }
  getcategory() { return this.postListingsForm.controls['category'].value }

  updateImageName(value: any) { this.postListingsForm.patchValue({ imageName: value }); }
  updateImageType(value: any) { this.postListingsForm.patchValue({ imageType: value }); }

  //Categories
  categories: string[] = ["Health", "Energy", "Industry", "Utilities"];
  //Grid view
  dataSource: any;
  expandedElement: {
    imageName: string;
    imageType: string;
    cost: number;
    dimensions: string;
    tag: string;
    category: string;
    datePosted: string;
    imageUrl: string;
  } | undefined
  listingDetails?= [];
  columnsToDisplay: string[] = ['imageName', 'cost', 'category', 'datePosted'];

  constructor(private uploadService: FileUploadService, private listingService: ListingService,
    private notificationService: NotificationService, public firebaseService: FirebaseService,
  ) {
    this.getAllListings();
  }

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
  }

  // -------------------------------- Create a Listing ------------------------

  //Show create listing
  postToMarketplace() {
    this.post = true;
    this.view = false;
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
      this.updateImageName(this.selectedFiles[0].name);

      //read the extension of the image
      this.updateImageType(this.selectedFiles[0].name.split('.').pop());

      //preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.listImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedFiles[0]);
    }

  }

  uploadPicture(listId: string): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload, 'I', listId);
      }
    }
  }

  //Create a lisitngs
  postListings() {
    if (this.postListingsForm.valid) {
      //get current date
      let today = new Date();
      //append all the listing data
      let listingData = {
        ...this.postListingsForm.value,
        datePosted: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
      }
      //create a listing
      this.listingService.createListings(listingData).then(res => {
        //upload the image along with the created listing
        this.uploadPicture(res.id);
        this.notificationService.success("Image listing created successfully");
        this.resetForm();
      });
    }
  }

  // -------------------------------View Listings --------------------------------

  //Show Marketplace
  viewMarketplace() {
    this.view = true;
    this.post = false;
    this.getAllListings();
  }

  //Get all the listings
  getAllListings() {
    this.listingService.getListings().pipe(
      map((data: any[]) =>
        data.map(c =>
        ({
          // id: c.payload.doc.id, //store image id if needed
          ...c.payload.doc.data()
        })
        )
      )
    ).subscribe((data: any) => {
      this.listingDetails = data;
      this.dataSource = new MatTableDataSource(this.listingDetails);
      //initialize here for MatSort & MatPaginator
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }


  applyFilter(event: Event) {
    //custom filter

    // this.dataSource.filterPredicate = (data: any, filter: any) => {
    //   return this.columnsToDisplay.some(ele => {
    //     return ele != 'category' && data[ele].toLowerCase().indexOf(filter) != -1;
    //   });
    // };

    //filter operation for all columns

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }





  resetForm() {
    //reset form
    this.postListingsForm.reset();
    //clear image
    this.fileInput.nativeElement.value = '';
    this.listImage = '';
  }



}
