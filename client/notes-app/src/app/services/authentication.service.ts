import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDetails } from '../interfaces/userDetails';
import { TokenResponse,TokenPayload } from '../interfaces/Tokens';


@Injectable({
  providedIn:'root'
})

export class AuthenticationService {
  private token!: string|null;
  private role!:string|null;
  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.token = token;
  }
  private saveRole(role: string): void {
    localStorage.setItem('role', role);
    this.role = role;
  }

  private getToken(): string|null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    this.role  = '';
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('role');
    this.router.navigateByUrl('/login');
  }
  public getUserDetails(): UserDetails| null {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return localStorage.getItem('token')!==null;
    } else {
      return false;
    }
  }

  private request(method: 'post'|'get', type: 'login'|'register'|'home', user?: TokenPayload): Observable<TokenResponse> {
    let base;

    if (method === 'post') {
      base = this.http.post(`http://localhost:4000/api/${type}`, user);
    } else {
      base = this.http.get(`http://localhost:4000/api/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }

    const request = base.pipe(
     map((data:any) => {
       console.log(data);
        if (data.token) {
          this.saveRole(data.role);
          this.saveToken(data.token);
        }
        return data;
    })

    );
    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public isAdmin():boolean{
    this.role = localStorage.getItem('role');
    return this.role==="admin";
  }
   
  


}