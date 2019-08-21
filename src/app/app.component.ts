import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { throttleTime } from 'rxjs/operators'
import { Role } from './helpers/model/Role';
import { User } from './helpers/model/User';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private showComponents;
  private currentUser:User;

  constructor(private router:Router,private authService:AuthService){

    this.authService.currentUser.subscribe(x=>this.currentUser=x);

    router.events
    .pipe(
      throttleTime(200)
    )
    .subscribe(val=>{
      this.showComponents=
        (val['url']=='/login')?
        false:true;
    });
  } 
  get isAdmin(){
    return this.currentUser&& this.currentUser.role===Role.Admin;
  }
}
