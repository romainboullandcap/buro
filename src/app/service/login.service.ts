import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { catchError, Observable, tap } from "rxjs";
import { ENV } from "../env";
import { LocalStorageService } from "./localstorage.service";
import { Router } from "@angular/router";
import { User } from "../model/user";
import { ApiService } from "./api.service";
import { UserService } from "./user.service";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class LoginService extends ApiService {
  
  
  http = inject(HttpClient);
  localStorageService = inject(LocalStorageService);
  userService = inject(UserService);
  router = inject(Router);

  currentUser = signal<User | undefined>(undefined);
  
  login(email: string, password: string): Observable<any> {
    return this.http.post<{token : string, user : User}>(`${ENV.API_URL}/login`, {
      email: email,
      password: password,
    }).pipe(
      tap(res => {
        this.currentUser.set(res.user);
        this.localStorageService.setToken(res.token);
        this.router.navigate(["/home"]);
    }),
    catchError(error =>this.handleErrorObs(error)))
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${ENV.API_URL}/register`, {
      email: email,
      password: password,
    }).pipe(catchError(error =>this.handleErrorObs(error)));
  }

  logout() {
    this.localStorageService.removeToken();
    this.currentUser.set(undefined);
    this.router.navigate(["/login"]);
  }

  hasToken() {
    return this.localStorageService.hasToken();
  }

  // 
  isAuthenticated(){
    return this.currentUser() !== undefined;
  }

  // If token is present, decode it and fetch user to set it as current User
  // then go to home. If the token is expired, fetching user will throw 401 and go back to login.
  tryAuthWithToken() {
    if (this.hasToken()) {
      const token = this.localStorageService.getToken();
      const decoded = jwtDecode<{userId : number}>(token!);
      this.userService.getById(decoded.userId).subscribe(user=> {
        this.currentUser.set(user);
        this.router.navigate(["/home"]);
      })
      
    }
  }  
}
