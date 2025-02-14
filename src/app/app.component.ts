import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LocalStorageService } from "./service/localstorage.service";
import { AgendaComponent } from "./agenda/agenda.component";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DesktopService } from "./service/desktop.service";
import { Desktop } from "./model/desktop";
import { BookingComponent } from "./booking/booking.component";

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

  onLogoutClick() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    this.localstorageService.setCurrentUserEmail("");
    this.router.navigate(["/login"]);
  }

  openBookingDialog(): void {
    this.dialog.open(BookingComponent, {
      maxWidth: "100%",
      //height: "75%",
      minWidth: "30%",
      data: { desktopList: this.desktopList },
    });
  }
}
