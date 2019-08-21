import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Role } from '../helpers/model/Role';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private currentUser;

  constructor(private authService:AuthService,private router:Router) {
    this.authService.currentUser.subscribe(x=>this.currentUser=x);
   }

  ngOnInit() {
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
}

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
