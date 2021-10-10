import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  // profileForm = this.fb.group({
  //   fullName:['',Validators.required],
  //   webSiteUrl:['',Validators.required],
  //   email:['',Validators.required, Validators.email]    
  // })

  profileForm: FormGroup = new FormGroup({
    fullName: new FormControl('',[Validators.required]),
    webSiteUrl: new FormControl('',[Validators.required]),
    email:new FormControl('',[Validators.required, Validators.email])
  })
  
  

  ngOnInit(): void {
  }

  onSubmit(){

  }

  uploadPicture(){
    
  }

  resetForm(){
    this.profileForm.reset();
  }

}
