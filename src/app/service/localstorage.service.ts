import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  currentUserEmail = signal<string | null>("");

  constructor() {
    if (localStorage.getItem("email")) {
      this.currentUserEmail.set(localStorage.getItem("email")!);
    }
  }

  setCurrentUserEmail(email: string) {
    localStorage.setItem("email", email);
    this.currentUserEmail.set(email);
  }

  unsetCurrentUserEmail(){
    localStorage.removeItem("email");
    this.currentUserEmail.set(null);
  }

  hasToken() {
    return localStorage.getItem("token") !== null;
  }
}
