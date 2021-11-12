import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  AuthGuardService } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { UploadsComponent } from './uploads/uploads.component';
import { AdminGuardService } from './services/admin-guard.service';
import { AdminComponent } from './admin/admin.component';
import { AdminService } from './services/admin.service';
import {MatExpansionModule} from '@angular/material/expansion'
import { AzureBlobStorageService } from './services/azure-storage-blob.service';
import {MatGridListModule} from '@angular/material/grid-list';
import { DisplayNotesComponent } from './display-notes/display-notes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService]  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]  },
  //{ path: '**', redirectTo: '' },
  { path: 'upload', component: UploadsComponent, canActivate: [AuthGuardService]  },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuardService]  },
  { path: 'notes/:subject', component: DisplayNotesComponent,canActivate: [AuthGuardService]}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UploadsComponent,
    AdminComponent,
    DisplayNotesComponent,
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    NgbModule,
    MatToolbarModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatExpansionModule,
    CommonModule,
    RouterModule.forRoot(
      appRoutes, 
    )
  ],
  providers: [AuthGuardService, AuthenticationService, AdminGuardService,AdminService,AzureBlobStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
