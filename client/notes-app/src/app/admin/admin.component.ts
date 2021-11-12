import { Highlightable } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component,ChangeDetectionStrategy, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AdminService } from '../services/admin.service';
import { AuthenticationService } from '../services/authentication.service';
import { AzureBlobStorageService } from '../services/azure-storage-blob.service';

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
 constructor(public auth:AuthenticationService, public adminService:AdminService,  public azureService:AzureBlobStorageService, private router:Router,private http:HttpClient) { }
  

  ngOnInit(): void {
    this.adminService.getUploads().subscribe((res) => {
      console.log(res.blobs);
      this.uploadsArray=res.blobs;
    }, (err) => {
      console.error(err);}
    );
  }

  deleteFile(file:any){
  this.azureService.deleteNotes(file.sasToken,file.name, file.url, () => {
    const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        });
    //this.reloadFiles();
  });
  }

  openFile(file:any){
    this.azureService.downloadPDF(file.url,file.sasToken, file.name, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  verifyFile(file:any){
    this.azureService.verifyNotes(file.sasToken,file.name,file.metadata);
    const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        });
  }

  reloadFiles(){

  }

}
