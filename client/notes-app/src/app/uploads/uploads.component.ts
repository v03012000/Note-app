import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

//import { UploadService } from '../services/upload.service';
import { FormGroup, FormControl,FormGroupDirective, Validators} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {
  
  majors: String[] = [
    'Computer Engineering',
    'Electrical Engineering',
    'Electronics and communication',
    'Information Technology'
  ];
  
  years: number[] = [];
  computerSubjects:String[]=['Operating Systems','Design and Analysis of Algorithms','Machine Learning','Artificial Intelligence', 'Object Oriented Programming'];
  itSubjects:String[]=['Operating Systems','Design and Analysis of Algorithms','Machine Learning','Artificial Intelligence', 'Object Oriented Programming'];
  electronicsSubjects:String[]=['Signals and Systems','Analog circuits','Digital Electronics','Electromagnet Theory'];
  electricalSubjects:String[]=['Power electronics','Microcontrollers','Power Systems','Analog Electronics'];
  subjects:String[]=[];
  selectedMajor:String='';
  selectedYear!:number;
  selectedSubject:String='';
  cyear:number;
  fileName = '';  
  file: File|null = null;
  formData = new FormData();
  myForm!:FormGroup;
  pdfPreview!:string|undefined;
  admin:boolean=false;
  ngOnInit(): void {
    if(localStorage.getItem("role")==="admin"){
      this.admin=true;
     }
    this.myForm = new FormGroup({
    samplefile:new FormControl(null, [Validators.required]),
    Major:new FormControl(null,[Validators.required]),
    Year:new FormControl(null,[Validators.required]),
    Subject:new FormControl(null,[Validators.required])
  });
  }

    constructor(private http: HttpClient,public auth:AuthenticationService,private router:Router,private _snackBar: MatSnackBar) {
      this.cyear = new Date().getFullYear()+4;
      for (let year = this.cyear; year >= 2015; year--) {
       this.years.push(year);
      }
  }

  goToAdmin(){
    this.router.navigate(['/admin']);
  }
  goToHome(){
    this.router.navigate(['/home']);
  }
    
    majorChanged(event:any){
      console.log(event);
      const val=event.value;
    if(val && val==='Computer Engineering'){
      this.subjects=this.computerSubjects;
    }
    else if(val && val==='Electrical Engineering'){
      this.subjects=this.electricalSubjects;
    }
    else if(val && val==='Electronics and communication'){
      this.subjects=this.electronicsSubjects; 
    }
    else if(val && val==='Information Technology'){
      this.subjects=this.itSubjects;
    }
  console.log(this.subjects);
    }
    onFileInput(event:any): void {
      if (event.target.files.length > 0) {
        const file = event.target.files[0] as File;
        this.file=event.target.files[0] as File;
        this.myForm.patchValue({
          samplefile: file,
         });
         console.log(this.myForm.value,"heree");
         this.myForm.get('image')?.updateValueAndValidity();
          const reader = new FileReader();
          reader.onload = () => {
          this.pdfPreview = reader.result?.toString();
          };
          reader.readAsDataURL(file);
        //console.log(this.myForm.get("samplefile"),"heree");
      }
      
    }
    
  
    onSubmit(formDirective: FormGroupDirective,variable: any) {
      const post = {
        samplefile: this.myForm.value.samplefile,
        Major: this.myForm.value.Major,
        Year: this.myForm.value.Year,
        Subject:this.myForm.value.Subject
        };
     
      if(this.file===null){
      alert("Add the Notes file");
      }
      else if(this.file.type==="application/pdf"){
        let uploadfile:File=this.file;
        console.log(uploadfile);
        this.formData.append('samplefile',post.samplefile); 
        this.formData.append('major',post.Major);
        this.formData.append('year',post.Year);
        this.formData.append('subject',post.Subject); 
        this.http.post('http://localhost:4000/api/upload', this.formData).subscribe((err)=>{
          console.log(err);
        });
        
        variable.value=null;
        this.myForm.reset();
        formDirective.resetForm();
          
      }
      else{
        alert("Upload a pdf file");
      }
      const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        this._snackBar.open("File Uploaded sucessfully", "Ok");
    }); 
  }
  


/*
form!: FormGroup;
imagePreview!: string| undefined;
posts: Post[] =[];
constructor(private http: HttpClient,public auth:AuthenticationService) { }

ngOnInit(): void {
this.form = new FormGroup({
title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
description: new FormControl(null, {validators: [Validators.required]}),
image: new FormControl(null, {validators: [Validators.required]})
});
}

onSavePost() {
if (!this.form.valid) {
return;
}
const post = {
id: null,
title: this.form.value.title,
description: this.form.value.description,
image: this.form.value.image
};
console.log(post);
const temp=post;
console.log(temp.image);
const postData = new FormData();
postData.append('title', post.title);
postData.append('description', post.description);
postData.append('image', post.image);

this.http.post<{ message: string, post: Post }>('http://localhost:4000/api/upload', postData).subscribe((res) => {
  console.log(res);
}, error => {
console.log(error);
});
//this.postService.addPost(post);
this.form.reset();
}

onSelect(event: any) {
const file = (event.target.files[0]);
this.form.patchValue({image: file});
console.log(this.form.value);
this.form.get('image')?.updateValueAndValidity();
console.log(this.form.get('image')?.value);
const reader = new FileReader();
reader.onload = () => {
this.imagePreview = reader.result?.toString();
};
reader.readAsDataURL(file);
}*/
}
