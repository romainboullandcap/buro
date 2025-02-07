import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { authGuard } from "./auth.guard";
const routeConfig: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent,
    title: "Login page",
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: "**",
    component: HomeComponent,
    canActivate: [authGuard],
  },
];
export default routeConfig;
