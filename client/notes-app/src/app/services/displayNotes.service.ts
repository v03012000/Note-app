import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



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
}