import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { fakeBackProvider } from './helpers/fake-backend';
import { JwtInterceptor } from './helpers/Jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    ErrorComponent,
    LoadingComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule 
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true},
  fakeBackProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
