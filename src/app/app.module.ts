import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ManageComponent } from './manage/manage.component';
import { OperateComponent } from './operate/operate.component';
import { AddComponent } from './add/add.component';

const appRoutes: Routes = [
  { path: 'signin',      component: SignInComponent  },
  { path: '',            component: SignInComponent  },
  { path: 'signup',      component: SignUpComponent  },
  { path: 'manage',      component: ManageComponent  },
  { path: 'add',         component: AddComponent     },
  { path: 'operate', component: OperateComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ManageComponent,
    OperateComponent,
    AddComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true, // <-- debugging purposes only
        useHash: true }
    ),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
