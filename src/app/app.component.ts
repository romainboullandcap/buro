import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
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
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <div>
            <h1>Buro</h1>
          </div>
          <div class="name flex align-center">
            @if(this.desktopList && this.desktopList.length > 0) {
            <div>
              <button mat-mini-fab (click)="onAgendaClick()">
                <mat-icon>calendar_today</mat-icon>
              </button>
            </div>
            }

            <div class="ml-1">{{ localstorageService.currentUserEmail() }}</div>
          </div>
        </header>
      </a>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "homes";
  currentUserEmail: string | null = "";
  desktopService = inject(DesktopService);

  localstorageService = inject(LocalStorageService);
  desktopList: Desktop[] = [];

  readonly dialog = inject(MatDialog);

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
}
