import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  breakpoint=4;
 
  clickedComputer:boolean=false;
  clickedInformation:boolean=false;
  clickedElectrical:boolean=false;
  clickedElectronics:boolean=false;
  constructor(public auth:AuthenticationService, private router:Router) { }

  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : (window.innerWidth <= 700)?2:(window.innerWidth <= 1100)?3:4;
}

selectedSubject(major:string, subject:string){
console.log(major, subject);
this.router.navigate(['/notes', subject])

}

onResize(event:any) {
  this.breakpoint = (event.target.innerWidth <= 400) ? 1 : (window.innerWidth <= 700)?2:(window.innerWidth <= 1100)?3:4;
}

}
