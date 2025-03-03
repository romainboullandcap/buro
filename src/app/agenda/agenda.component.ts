import { Component, ViewEncapsulation, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { Desktop } from "../model/desktop";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { Booking } from "../model/booking";
import { BookingTableComponent } from "../booking-table/booking-table.component";
import { LoginService } from "../service/login.service";
import { DateTime } from "luxon";

@Component({
  selector: "app-agenda",
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
    CommonModule,
    BookingTableComponent,
  ],
  templateUrl: `agenda.component.html`,
  styleUrl: `agenda.component.scss`,
  encapsulation: ViewEncapsulation.None,
})
export class AgendaComponent {
  desktopList = input<Desktop[] | undefined>([]);
  loginService = inject(LoginService);

  constructor() {}

  getFutureBookingSorted(): Booking[] {
    const res = this.desktopList()!
      .flatMap((desktop) =>
        desktop.bookings.filter(
          (booking) => booking.userId === this.loginService.currentUser()?.id
        )
      )
      .filter(
        (booking) =>
          booking != null &&
          booking.date.diff(DateTime.now().startOf("day")).toMillis() >= 0
      )
      .sort((a, b) => a.date.toMillis() - b.date.toMillis());
    return res;
  }
}
