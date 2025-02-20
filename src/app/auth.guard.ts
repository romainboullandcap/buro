import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LoginService } from "./service/login.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService)

  const result = loginService.isAuthenticated();
  console.log("navigate ", route, result);
  if (!result) {
    console.log("Not authenticated - redirect to login");
    router.navigate(["login"]);
  }
  return result;
};
