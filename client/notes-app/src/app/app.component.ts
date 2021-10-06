import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenResponse } from './interfaces/Tokens';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser!: string;
  title = 'notes-app';
  constructor(public auth: AuthenticationService,private router: Router,) {
  }
  ngOnInit(){
    if(!this.auth.isLoggedIn()){
    this.auth.logout();
    this.router.navigate(['/login']);
    }
  }
}
