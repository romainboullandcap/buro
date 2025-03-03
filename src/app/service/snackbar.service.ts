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
    this.isEnabled = false;
  }
  enable() {
    this.isEnabled = true;
  }

  open(message: string, action?: string, config?: MatSnackBarConfig) {
    if (!config) {
      config = { duration: 5000 };
    }
    if (this.isEnabled) {
      this.snackbarService.open(message, action, config);
    }
  }
}
