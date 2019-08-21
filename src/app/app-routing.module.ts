import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AuthGuard } from './helpers/auth.guard';
import { Role } from './helpers/model/role';
import { RegistrationComponent } from './registration/registration.component';


const routes: Routes = [
  {path:'',component:HomeComponent,canActivate: [AuthGuard]},
  {path:'admin',component:AdminComponent,canActivate: [AuthGuard],data:{roles:[Role.Admin]}},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegistrationComponent},
  {path:'404',component:ErrorComponent},
  {path:'**',redirectTo:'/404'},
  {path:'home',redirectTo:'/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
