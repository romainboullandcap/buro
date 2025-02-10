import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

export const errorSnackbarInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackBar = inject(MatSnackBar);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 404) {
        _snackBar.open("Endpoint API non trouvé");
      } else if (err.status === 401) {
        _snackBar.open("Veuillez vous authentifier", "Masquer", {
          duration: 3000,
        });
        router.navigate(["/login"]);
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
