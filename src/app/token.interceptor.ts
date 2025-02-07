import {
  HttpEventType,
  HttpHandler,
  HttpInterceptorFn,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (localStorage.getItem("token")) {
    // If we have a token, we set it to the header
    req = req.clone({
      setHeaders: {
        Authorization: `Authorization Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
  return next(req);
};
