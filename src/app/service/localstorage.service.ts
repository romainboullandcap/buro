import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  currentUserEmail = signal<string>("");

  constructor() {
    const current = localStorage.getItem("email");
    if (current !== null) {
      this.currentUserEmail.set(current);
    }
  }

  setCurrentUserEmail(email: string) {
    localStorage.setItem("email", email);
    this.currentUserEmail.set(email);
  }
}
