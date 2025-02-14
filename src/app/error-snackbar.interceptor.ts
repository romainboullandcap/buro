import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { SnackbarService } from "./service/snackbar.service";

export const errorSnackbarInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 404) {
        snackbarService.open("Endpoint API non trouvé");
      } else if (err.status === 401) {
        snackbarService.open("Veuillez vous authentifier", "Masquer", {
          duration: 3000,
        });
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        router.navigate(["/login"]);
      } else {
        snackbarService.open("Erreur : " + getErrorMessage(err), "", {
          duration: 5000,
        });
      }
      return throwError(() => err);
    })
  );
};

function getErrorMessage(err: any) {
  if (err.error.errors) {
    return err.error.errors.map((error: any) => error.message).join(", ");
  } else if (err.error) {
    return err.error;
  } else if (err.message) {
    return err.message;
  } else {
    return err;
  }
}
