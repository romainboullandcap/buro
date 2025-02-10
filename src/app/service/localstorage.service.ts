import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  currentUserEmail = signal<string>("");

  constructor() {
    if (localStorage.getItem("email")) {
      this.currentUserEmail.set(localStorage.getItem("email")!);
    }
  }

  setCurrentUserEmail(email: string) {
    localStorage.setItem("email", email);
    this.currentUserEmail.set(email);
  }

  hasToken() {
    return localStorage.getItem("token") !== null;
  }
}
