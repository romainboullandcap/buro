import { Component, ViewEncapsulation, input } from "@angular/core";
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

  constructor() {}

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === "month") {
      return this.desktopList()?.some((desktop) =>
        desktop.bookings.some((booking) => {
          const date = new Date(booking.date);
          return (
            booking.email === localStorage.getItem("email") &&
            date.toLocaleDateString() === cellDate.toLocaleDateString()
          );
        })
      )
        ? "booked-date"
        : "";
    }
    return "";
  };

  getBookingSorted(): Booking[] {
    const res = this.desktopList()!
      .flatMap((desktop) => 
        desktop.bookings
          .filter((booking) => booking.email === localStorage.getItem("email")))
      .filter((bookingMap) => bookingMap != null)
      .sort(
        (a, b) => new Date(a?.date!).getTime() - new Date(b?.date!).getTime()
      );
    return res;
  }
}
