import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {}

  canActivate() {
      //console.log(this.auth.isLoggedIn() , this.auth.isAdmin())
    if (!this.auth.isLoggedIn() || !this.auth.isAdmin()) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}