import { Component, OnInit , ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { DisplayNotesService } from '../services/displayNotes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchform!: FormGroup;
  searchtext!: FormControl;
  breakpoint=4;
  options: any[]=[];
  filteredOptions!: Observable<string[]>;
  @ViewChild('searchbar') searchbar!: ElementRef;
  searchText:String = '';
  document_obj!:any;
  toggleSearch: boolean = false;
  clickedComputer:boolean=false;
  clickedInformation:boolean=false;
  clickedElectrical:boolean=false;
  clickedElectronics:boolean=false;
  admin:boolean=false;
  @Output() public sidenavToggle = new EventEmitter();
  constructor(public auth:AuthenticationService, private router:Router, private displayNotesService:DisplayNotesService,private http:HttpClient) { }

  ngOnInit() {
    if(localStorage.getItem("role")==="admin"){
      this.admin=true;
     }
    this.breakpoint = (window.innerWidth <= 400) ? 1 : (window.innerWidth <= 700)?2:(window.innerWidth <= 1100)?3:4;
    this.createFormControls();
    this.createForm();
    if(localStorage.getItem("role")==="admin"){
      this.admin=true;
     }
  }
  public onToggleSidenav = () => { 
    this.sidenavToggle.emit();
  }

  goToAdmin(){
    this.router.navigate(['/admin']);
  } 
  goToUploads(){
    this.router.navigate(['/upload']);
  }
  goToFavourites(){
    this.router.navigate(['/favourites']);
  }
  createFormControls() {
    this.searchtext = new FormControl('', Validators.required); 
  }
  createForm() {
    this.searchform = new FormGroup({
      searchtext:this.searchtext,
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase(); 
    console.log(filterValue);
    this.displayNotesService.getSuggestions(filterValue).subscribe(res=>{
      const suggest=res.suggest;
      this.options=suggest["notes-suggest"][0].options;
      console.log(this.options);
    });
    return this.options;
  }


onInputChange(event: any){
  const value=event.target.value;
  this._filter(value);
  }

onChangeOption(option:any){
this.document_obj=option;
}

selectedSubject(major:string, subject:string){
console.log(major, subject);
this.router.navigate(['/notes', subject])

}

onResize(event:any) {
  this.breakpoint = (event.target.innerWidth <= 400) ? 1 : (window.innerWidth <= 700)?2:(window.innerWidth <= 1100)?3:4;
}

search(formDirective: FormGroupDirective){
  const body=this.document_obj;
  const id=body._id;
  this.router.navigate(['/search',id])   
}
}
