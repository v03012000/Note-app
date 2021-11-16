import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { request } from 'http';



@Injectable({
  providedIn:'root'
})

export class DisplayNotesService {
    array:any []=[];
    constructor(private http: HttpClient) {}
   // base = this.http.get(`http://localhost:4000/api/`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
   getNotes(subject:string|null): Observable<any> {
   const base=this.http.get(`http://localhost:4000/api/getNotes/${subject}`, {responseType: 'json'});
   const request = base.pipe(
    map((data:any) => {
       this.array.push(data);
       return data;
   }));
   return request;
   }

   addReview(info:any,notes:any,user_id?:any,name?:any):Observable<any> {
     //console.log(info,notes.id,user_id,name);
    return this.http.post(`http://localhost:4000/api/${notes.id}/addreview`,{document:notes.id,review:info.comment,rating:info.rating,user:user_id,username:name}).pipe(
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