import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const result = localStorage.getItem("email") !== null;
  if (!result) {
    console.log("Not authenticated - redirect to login");
    router.navigate(["login"]);
  }
  return result;
};
