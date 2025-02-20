import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { ENV } from "../env";
import { LocalStorageService } from "./localstorage.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  
  http = inject(HttpClient);
  localstorageService = inject(LocalStorageService);
  router = inject(Router);
  
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${ENV.API_URL}/login`, {
      email: email,
      password: password,
    });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${ENV.API_URL}/register`, {
      email: email,
      password: password,
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    this.localstorageService.setCurrentUserEmail("");
    this.router.navigate(["/login"]);
  }
}
