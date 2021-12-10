import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { request } from 'http';



@Injectable({
  providedIn:'root'
})

export class FavouritesService {
    array:any []=[];
    constructor(private http: HttpClient) {}

    getAllFavourites(user:String|undefined):Observable<any>{
    const base=this.http.get(`http://localhost:4000/api/getfavourites/${user}`, {responseType: 'json'});
    const request = base.pipe(
    map((data:any) => {
       this.array.push(data);
       return data;
   }));
   return request;
    }

    removeFromFavourites(notes:String,user:String|undefined):Observable<any>{
        return this.http.post(`http://localhost:4000/api/${notes}/removefavourite`,{document:notes,user:user}).pipe(
          retry(1),  
          catchError(this.handleError)
        );
       }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          alert(error.error);
          //console.error(
          //  `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(
          'Something bad happened; please try again later.');
      }
}