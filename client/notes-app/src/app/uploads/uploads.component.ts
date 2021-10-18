import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

//import { UploadService } from '../services/upload.service';
import { FormGroup, FormControl,FormGroupDirective, Validators} from '@angular/forms';
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
  Year: number;
  selectedYear!:number;
  selectedSubject:String='';
  fileName = '';  
  file: File|null = null;
  formData = new FormData();
  myForm = new FormGroup({
  fileSource: new FormControl('', [Validators.required]),
  Major:new FormControl('',[Validators.required]),
  Year:new FormControl('',[Validators.required]),
  Subject:new FormControl({value:''},Validators.required)
});
  ngOnInit(): void {

  }

    constructor(private http: HttpClient) {
      this.Year = new Date().getFullYear()+4;
      for (let year = this.Year; year >= 2015; year--) {
       this.years.push(year);
      }
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
        const samplefile = event.target.files[0] as File;
        this.file=event.target.files[0] as File;
        this.myForm.patchValue({
          fileSource: samplefile
        });
      }
      
    }
    
  
    onSubmit(formDirective: FormGroupDirective,variable: any) {
      console.warn(this.myForm.value);
      if(this.file===null){
      alert("Add the Notes file");
      }
      else if(this.file.type==="application/pdf"){
        console.log(this.myForm.get('Major'));
        this.formData.append('samplefile', this.myForm.get('fileSource')?.value); 
        this.formData.append('major',this.myForm.get('Major')?.value);
        this.formData.append('year',this.myForm.get('Year')?.value);
        this.formData.append('subject',this.myForm.get('Subject')?.value); 
        this.http.post('http://localhost:4000/api/upload', this.formData)
        .subscribe(res => {
          console.log(res);
        });
        variable.value=null;
        this.myForm.reset();
        formDirective.resetForm(); 
         
      }
      else{
        alert("Upload a pdf file");
      }
      
  }
  

}
