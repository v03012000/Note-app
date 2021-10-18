import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  upload(file: File): Observable<any> {
    const data = new FormData();
    data.append('file', file);
    return this.http.post('http://localhost:4000/api/upload', data);
  }
}