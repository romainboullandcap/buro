import { Component, inject } from "@angular/core";
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  RequiredValidator,
  Validators,
} from "@angular/forms";
import { LoginService } from "../service/login.service";
import { Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { LocalStorageService } from "../service/localstorage.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-login",
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  loginService = inject(LoginService);
  router = inject(Router);
  localStorageService = inject(LocalStorageService);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });
  errorMessage: string = "";

  _snackBar = inject(MatSnackBar);

  constructor() {
    if (localStorage.getItem("token") !== null) {
      this.router.navigate(["/home"]);
    }
  }

  loginClick() {
    this.loginService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (res) => {
          this.localStorageService.setCurrentUserEmail(
            this.loginForm.value.email
          );
          localStorage.setItem("token", res.token);
          this.router.navigate(["/home"]);
        },
        error: (err) => {
          this.loginForm.reset();
          this.errorMessage = "Erreur à la connexion";
        },
      });
  }

  registerClick() {
    this.loginService
      .register(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (res) => {
          this._snackBar.open("Compte créé, vous pouvez vous connecter", "", {
            duration: 3000,
          });
        },
        error: (err) => {
          this.loginForm.reset();
          this.errorMessage = "Erreur à la connexion";
        },
      });
  }
}
