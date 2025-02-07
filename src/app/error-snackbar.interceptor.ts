import { HttpEventType, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

export const errorSnackbarInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackBar = inject(MatSnackBar);
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 404) {
        _snackBar.open("Endpoint API non trouvé");
      } else {
        _snackBar.open("Erreur : " + getErrorMessage(err), "", {
          duration: 5000,
        });
      }
      return throwError(() => new Error("API Exception"));
    })
  );
};

function getErrorMessage(err: any) {
  if (err.error.errors) {
    return err.error.errors.map((error: any) => error.message).join(", ");
  } else {
    return err.error;
  }
}
