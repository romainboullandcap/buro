import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { ENV } from "../env";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  http = inject(HttpClient);

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${import.meta.env["API_URL"]}/login`, {
      email: email,
      password: password,
    });
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${import.meta.env["API_URL"]}/register`, {
      email: email,
      password: password,
    });
  }
}
