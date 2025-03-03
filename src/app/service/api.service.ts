import { inject } from "@angular/core";
import { SnackbarService } from "./snackbar.service";
import { Observable, of, throwError } from "rxjs";

export class ApiService {
  snackBarService = inject(SnackbarService);

  isServerUnreachble(error: any): boolean {
    return (
      error.name === "HttpErrorResponse" &&
      error.statusText === "Unknown Error" &&
      error.status === 0
    );
  }

  handleErrorObs(error: any): Observable<any> {
    if (this.isServerUnreachble(error)) {
      this.snackBarService.open(`Le serveur est injoignable`);
      return of("");
    } else {
      return throwError(() => error);
    }
  }
}
