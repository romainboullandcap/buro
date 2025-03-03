import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {

  constructor() {
  }

  setToken(token : string){
    localStorage.setItem("token", token);
  }

  getToken(){
    return localStorage.getItem("token");
  }

  hasToken() {
    return localStorage.getItem("token") !== null;
  }

  removeToken() {
    localStorage.removeItem("token");
  }


}
