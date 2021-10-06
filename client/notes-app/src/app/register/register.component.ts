import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TokenPayload } from '../interfaces/Tokens';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
 /* form = new FormGroup({
    email: new FormControl('Nancy'),
    username: new FormControl('Drew'),
    password: new FormControl('hello', Validators.minLength(4))
  });*/
  registerform!: FormGroup;
  username!: FormControl;
  password!: FormControl;
  email!: FormControl;
  
  constructor( public auth:AuthenticationService) {}

  credentials: TokenPayload = {
    email: this.email?.value,
    username:this.username?.value,
    password:this.password?.value
  };
  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.username = new FormControl('', Validators.required);
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
    this.registerform = new FormGroup({
      username:this.username,
      email: this.email,
      password: this.password,
    });
  }
  register(formDirective: FormGroupDirective) {
    
    this.auth.register(this.credentials).subscribe((res) => {
      console.log(res);
    }, (err) => {
      console.error(err);
    });
    formDirective.resetForm();
    this.registerform.reset();
   
  }
 
}