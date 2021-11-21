import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticationService } from '../services/authentication.service';
import { AzureBlobStorageService } from '../services/azure-storage-blob.service';
import { DisplayNotesService } from '../services/displayNotes.service';
import {MatSnackBar} from '@angular/material/snack-bar';
export interface DialogData {
  comment: string;
  rating: number;
}
@Component({
  selector: 'app-display-notes',
  templateUrl: './display-notes.component.html',
  styleUrls: ['./display-notes.component.css']
})
export class DisplayNotesComponent implements OnInit {
  admin:boolean=false;
  user!:String;
  resultsArray:any []=[];
  reviewsAray:any []=[];
  subject!:string|null;
  document_id!:string|null;
  comment!: string;
  rating!: string;
  link!:SafeResourceUrl;
  userFavourites:Map<String,Boolean>=new Map();
  constructor(private route: ActivatedRoute, private displayNotesService:DisplayNotesService, private azureService:AzureBlobStorageService,public dialog: MatDialog,public auth:AuthenticationService,private router:Router,private sanitizer: DomSanitizer,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user=this.auth.getUserDetails()?._id as String;
    if(localStorage.getItem("role")==="admin"){
     this.admin=true;
    }
    this.subject = this.route.snapshot.paramMap.get('subject');
    this.document_id=this.route.snapshot.paramMap.get('id');
    if(this.subject){
    this.displayNotesService.getNotes(this.subject).subscribe((res) => {
      console.log(res.blobs);
      this.resultsArray=res.blobs;
    }, (err) => {
      console.error(err);}
    );
    }
    else if(this.document_id){
      console.log(this.document_id);
      this.displayNotesService.search(this.document_id).subscribe((res)=>{
        console.log(res);
        this.resultsArray=res.documents;
      }, (err) => {
      console.error(err);}
    )
    }
    this.displayNotesService.getFavourites(this.auth.getUserDetails()?._id).subscribe((res)=>{
      this.userFavourites= new Map();
      Object.entries(res.favourites).forEach((entry)=>{
        this,this.userFavourites.set(entry[0],entry[1] as Boolean);
        
      })
      
      console.log(this.userFavourites);

    }, (err) => {
    console.error(err);}
  )
  }

  onShare(file:any){
    this.azureService.downloadPDF(file.url,file.sasToken, file.name, blob => {
      let url = window.URL.createObjectURL(blob);
      this.link = this.sanitizer.bypassSecurityTrustResourceUrl(url); 
      
      console.log(this.link);
    })

  }
  goToHome(){
    this.router.navigate(['/home']);
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
  
  sortByNewest(){
    this.resultsArray=this.resultsArray.sort((a, b) => {
      let temp1=new Date(a.uploaded_date).valueOf();
      let temp2=new Date(b.uploaded_date).valueOf();
      return temp2-temp1;
    }); 
  }

  sortByOldest(){
    this.resultsArray=this.resultsArray.sort((a, b) => {
      let temp1=new Date(a.uploaded_date).valueOf();
      let temp2=new Date(b.uploaded_date).valueOf();
      return temp1 - temp2;
    }); 
  }

  sortByRating(){
    this.resultsArray=this.resultsArray.sort((a, b) => {
      let temp1=a.ratings;
      let temp2=b.ratings;
      return temp2 - temp1;
    });
  }

  addToFavourites(notes:any){
    let user=this.auth.getUserDetails();
    this.displayNotesService.addToFavourites(notes,user?._id).subscribe();
    this.userFavourites.set(notes.id,true);
    this._snackBar.open("Added to favourites", "Ok");
  }

  removeFromFavourites(notes:any){
    let user=this.auth.getUserDetails();
    this.displayNotesService.removeFromFavourites(notes,user?._id).subscribe();
    this.userFavourites.set(notes.id,false);
    this._snackBar.open("Removed from favourites", "Ok");
  }



  openFile(file:any){
    this.azureService.downloadPDF(file.url,file.sasToken, file.name, blob => {
      console.log(file.url);
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  openAddReviewDialog(notes:any): void {
    const dialogRef = this.dialog.open(DialogOverviewDialog, {
      width: '300px',
      data: { comment: "", rating:0},
    });

    dialogRef.afterClosed().subscribe(result => {
      const info={
        "rating":result.rating,
        "comment":result.comment
      }
      console.log(result);
      const user=this.auth.getUserDetails();
      this.displayNotesService.addReview(info,notes,user?._id,user?.username).subscribe();
      setTimeout(()=>{ 
        const currentUrl = this.router.url;                          //<<<---using ()=> syntax
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);
          this._snackBar.open("Your Review is Added", "Ok");
          }); 
   }, 1000);
    });
  }

  openSeeReviewsDialog(notes:any){
    this.reviewsAray=notes.reviews;
    const dialogRef = this.dialog.open(DialogSeeReview, {
      width: '400px',
      data: { "reviews":this.reviewsAray},
    });
    dialogRef.afterClosed().subscribe(result => {  
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title>Add your Review</h1>
  <div mat-dialog-content>
    <p>Give ratings</p>
    <mat-form-field>
    <mat-select  [(ngModel)]="selectedChoice">
        <mat-option disabled>Choose your ratings</mat-option>
        <mat-option value="1"> 1 - Very Poor</mat-option>
        <mat-option value="2"> 2 - Poor</mat-option>
        <mat-option value="3"> 3 - Good</mat-option>
        <mat-option value="4"> 4 - Vey Good</mat-option>
        <mat-option value="5"> 5 - Excellent </mat-option>
    </mat-select>
    </mat-form-field>
    <p>Add a comment</p>
    <mat-form-field appearance="fill">
    <mat-label>Write your comment</mat-label>
    <textarea matInput [(ngModel)]="comment"></textarea>
    </mat-form-field>

  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="dialogRef.close()">Cancel</button>
    <button mat-button (click)="submit()">Submit</button>
  </div>`,
})
export class DialogOverviewDialog {
  selectedChoice!: number;
  comment!:String;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  submit(): void {
    this.dialogRef.close({"rating":this.selectedChoice,"comment":this.comment});
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 mat-dialog-title *ngIf="data.reviews.length>0"> All the reviews</h1>
  <h1 mat-dialog-title *ngIf="data.reviews.length===0">Currently there are no reviews of these notes. You can add your reviews also.</h1>
  <div mat-dialog-content>
  <mat-card style="margin:20px 20px;" *ngFor="let review of data.reviews">
  <mat-card-header>
  <mat-card-title>Review by {{review.name}} </mat-card-title>
  </mat-card-header>
  <mat-card-content>
            <p>
                Ratings: <ngb-rating style="color: #FFC107;font-size:20px;" [max]="5" [(rate)]="review.rating" [readonly]="true"></ngb-rating>
            </p>
            <p>
             Comment : {{review.comment}}
            </p>
          </mat-card-content>
  </mat-card>
  </div>
  <div mat-dialog-actions>
    <button mat-raised-button (click)="dialogRef.close()">Close</button>
  </div>`,
})


export class DialogSeeReview{

  constructor(
    public dialogRef: MatDialogRef<DialogSeeReview>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    console.log(data);
  }
}
