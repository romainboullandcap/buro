import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LoginService } from "./service/login.service";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService)

  const result = loginService.hasToken();
  if (!result) {
    router.navigate(["login"]);
  }
  return result;
};
