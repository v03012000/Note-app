import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenPayload } from '../interfaces/Tokens';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  
  loginform!: FormGroup;
  password!: FormControl;
  email!: FormControl;
  credentials: TokenPayload = {
    email: this.loginform?.value,
    password: this.loginform?.value
  };

  constructor(private auth: AuthenticationService, private router: Router) {}
  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);
    
  }
  createForm() {
    this.loginform = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }
  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigate(['/home']);
    }, (err) => {
      console.error(err);
    }); 
  }
}
