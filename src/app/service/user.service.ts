import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENV } from "../env";
import { DesktopService } from "./desktop.service";
import { ApiService } from "./api.service";
import { BehaviorSubject, catchError, tap } from "rxjs";
import { User } from "../model/user";

@Injectable({
  providedIn: "root",
})
export class UserService extends ApiService {
  
  http = inject(HttpClient);
  desktopService = inject(DesktopService);

  userListBS = new BehaviorSubject<User[]>([]);
  userList$ = this.userListBS.asObservable();


  constructor() {
    super();    
  }

  loadAll() {
    return this.http.get<User[]>(`${ENV.API_URL}/user`)
    .pipe(
      tap(data=>this.userListBS.next(data)),
      catchError(error =>this.handleErrorObs(error)))
  }

  getEmailForUserId(userId : number) {
    return this.userListBS.value.find(user=>user.id===userId)?.email;
  }
  
  getById(userId: any) {
    return this.http.get<User[]>(`${ENV.API_URL}/user/${userId}`)
    .pipe(
      catchError(error =>this.handleErrorObs(error)))
  }
}
