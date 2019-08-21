import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { first } from "rxjs/operators";
import { UserService } from "../user.service";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.scss"]
})
export class RegistrationComponent implements OnInit {
  private RegForm: FormGroup;
  private returnUrl: string;
  private submitted = false;
  private loading = false;
  private error = "";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.RegForm = this.fb.group(
      {
        username: ["", Validators.required],
        firstname: ["", Validators.required],
        lastname: ["", Validators.required],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required]
        
      },
      { validator: this.checkPasswords }
    );

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get controls() {
    return this.RegForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.RegForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService
      .register(this.RegForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(["/login"]);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
