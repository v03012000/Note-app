import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FavouritesService } from '../services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  admin:boolean=false;
  panelOpenState = false;
  favouritesArray:any []=[];
  constructor(private router:Router, public auth:AuthenticationService,private favouriteService:FavouritesService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(localStorage.getItem("role")==="admin"){
      this.admin=true;
     }
    this.favouriteService.getAllFavourites(this.auth.getUserDetails()?._id).subscribe((res)=>{
      this.favouritesArray=res.favourites;
      console.log(this.favouritesArray);
    });

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
  
  seeNotes(notes:any){
    this.router.navigate(['/search',notes.id]);
  }

  sortByNewest(){
    this.favouritesArray=this.favouritesArray.sort((a, b) => {
      let temp1=new Date(a.uploaded_date).valueOf();
      let temp2=new Date(b.uploaded_date).valueOf();
      return temp2-temp1;
    }); 
  }

  sortByOldest(){
    this.favouritesArray=this.favouritesArray.sort((a, b) => {
      let temp1=new Date(a.uploaded_date).valueOf();
      let temp2=new Date(b.uploaded_date).valueOf();
      return temp1 - temp2;
    }); 
  }

  sortByRating(){
    this.favouritesArray=this.favouritesArray.sort((a, b) => {
      let temp1=a.ratings;
      let temp2=b.ratings;
      return temp2 - temp1;
    });
  }
  removeFavourite(notes:any){
    console.log(notes.id);
    this.favouriteService.removeFromFavourites(notes.id,this.auth.getUserDetails()?._id).subscribe();
    setTimeout(()=>{ 
      const currentUrl = this.router.url;                          //<<<---using ()=> syntax
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        this._snackBar.open("Removed from Favourites", "Ok");
        }); 
 }, 1000);
}
  

}
