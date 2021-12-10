import { Highlightable } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component,ChangeDetectionStrategy, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AdminService } from '../services/admin.service';
import { AuthenticationService } from '../services/authentication.service';
import { AzureBlobStorageService } from '../services/azure-storage-blob.service';
import {MatSnackBar} from '@angular/material/snack-bar';
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
 constructor(public auth:AuthenticationService, public adminService:AdminService,  public azureService:AzureBlobStorageService, private router:Router,private http:HttpClient,private _snackBar: MatSnackBar) { }
  
  ngOnInit(): void {
    this.adminService.getUploads().subscribe((res) => {
      console.log(res.blobs);
      this.uploadsArray=res.blobs;
    }, (err) => {
      console.error(err);}
    );
  }

  goToHome(){
    this.router.navigate(['/home']);
  }
  goToUploads(){
    this.router.navigate(['/upload']);
  }
  deleteFile(file:any){
  this.azureService.deleteNotes(file.sasToken,file.name, file.url, file.id, () => {
    const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        this._snackBar.open("Notes deleted", "Ok");
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
    this.azureService.verifyNotes(file.sasToken,file.name,file.metadata,file.id);
    setTimeout(()=>{ 
      const currentUrl = this.router.url;                          //<<<---using ()=> syntax
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        this._snackBar.open("Notes verified", "Ok");
        }); 
 }, 1000);
  }
  mail(file:any){
    this.adminService.sendMail(file.metadata.uploaded_by,file).subscribe();
    this._snackBar.open("Mail sended sucessfully", "Ok");
  }

  reloadFiles(){

  }

}
