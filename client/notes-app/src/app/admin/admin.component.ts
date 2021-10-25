import { Highlightable } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component,ChangeDetectionStrategy, NgZone, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AdminComponent implements OnInit {
 details:any;
 uploadsArray:any []=[];
 panelOpenState = false;
  constructor(public auth:AuthenticationService, public adminService:AdminService, private cd: ChangeDetectorRef,private ngZone: NgZone ) { }
  

  ngOnInit(): void {
    this.adminService.getUploads().subscribe((res) => {
      console.log(res.blobs);
      this.uploadsArray=res.blobs;
    }, (err) => {
      console.error(err);}
    );
  }

  deleteFile(file:any){

  }

  openFile(file:any){

  }

  verifyFile(file:any){

  }

}
