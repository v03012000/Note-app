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
import { DialogOverviewDialog, DialogSeeReview, DisplayNotesComponent } from './display-notes/display-notes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavouritesComponent } from './favourites/favourites.component';
import { FavouritesService } from './services/favourites.service';
import { SanitizeUrlPipe } from './sanitizeUrl.pipe';
const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService]  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]  },
  //{ path: '**', redirectTo: '' },
  { path: 'upload', component: UploadsComponent, canActivate: [AuthGuardService]  },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuardService]  },
  { path: 'favourites', component: FavouritesComponent, canActivate: [AuthGuardService]  },
  { path: 'notes/:subject', component: DisplayNotesComponent,canActivate: [AuthGuardService]},
  { path: 'search/:id', component: DisplayNotesComponent,canActivate: [AuthGuardService]}
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
    DialogOverviewDialog,
    DialogSeeReview,
    FavouritesComponent,
    SanitizeUrlPipe
  ],
  imports: [
    BrowserModule,
    MatListModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    MatDialogModule,
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
  providers: [AuthGuardService, AuthenticationService, AdminGuardService,AdminService,AzureBlobStorageService,MatSnackBar,FavouritesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
