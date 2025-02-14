import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  snackbarService = inject(MatSnackBar);

  isEnabled = true;

  constructor() {}

  disable() {
    console.log("disable notif");
    this.isEnabled = false;
  }
  enable() {
    console.log("enable notif");
    this.isEnabled = true;
  }

  open(message: string, action?: string, config?: MatSnackBarConfig) {
    if (this.isEnabled) {
      this.snackbarService.open(message, action, config);
    }
  }
}
