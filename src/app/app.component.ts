import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LocalStorageService } from "./service/localstorage.service";
import { AgendaDialogComponent } from "./agenda-dialog/agenda-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DesktopService } from "./service/desktop.service";
import { Desktop } from "./model/desktop";

@Component({
  selector: "app-root",
  imports: [RouterModule, MatIconModule, MatButtonModule],
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "homes";
  currentUserEmail: string | null = "";
  desktopService = inject(DesktopService);

  localstorageService = inject(LocalStorageService);
  desktopList: Desktop[] = [];

  readonly dialog = inject(MatDialog);
  router = inject(Router);

  constructor() {
    this.desktopService.desktopList$.subscribe((d) => {
      this.desktopList = d;
    });
  }

  onAgendaClick(): void {
    this.dialog.open(AgendaDialogComponent, {
      width: "50vw",
      data: { desktopList: this.desktopList },
    });
  }

  onLogoutClick() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    this.localstorageService.setCurrentUserEmail("");
    this.router.navigate(["/login"]);
  }
}
