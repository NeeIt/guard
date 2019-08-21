import { Component, OnInit } from "@angular/core";
import { User } from "../helpers/model/User";
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit {
  private currentUser: User;
  private users = [];
  constructor(
    private authenticationService: AuthService,
    private userService: UserService
  ) {
    this.currentUser= this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.getAllUsers();
    
  }
  getAllUsers(){
    this.userService.getAll()
    .pipe(first())
    .subscribe(users => this.users = users);
  }
  deleteUser(id: number) {
    this.userService.delete(id)
        .pipe(first())
        .subscribe(() => this.getAllUsers());
}
}

