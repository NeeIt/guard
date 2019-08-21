import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder,Validators,FormGroup } from '@angular/forms'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm:FormGroup;
  private returnUrl:string;
  private submitted=false;
  private loading=false;
  private error ='';

  constructor(private fb:FormBuilder,private route:ActivatedRoute,private router:Router,private authService:AuthService) { 
    if(this.authService.currentUserValue){
      this.router.navigate(['/']);
    }
   }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || "/";
  }
  get controls(){return this.loginForm.controls;}

  onSubmit(){

    this.submitted = true;

    if(this.loginForm.invalid){
      return;
    }
    this.loading=true;
    this.authService.login(this.controls.username.value,this.controls.password.value)
    .pipe(first()).subscribe(
      data=>{this.router.navigate([this.returnUrl]) },
      error=>{
        this.error=error;
        this.loading=false;
      }
    );
  }

}
