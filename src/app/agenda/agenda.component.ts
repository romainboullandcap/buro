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

@Component({
  selector: "app-agenda",
  imports: [MatButtonModule, MatDatepickerModule, MatCardModule, CommonModule],
  templateUrl: `agenda.component.html`,
  styleUrl: `agenda.component.scss`,
  encapsulation: ViewEncapsulation.None,
})
export class AgendaComponent {
  desktopList = input<Desktop[]>([]);

  constructor() {}

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === "month") {
      return this.desktopList().some((desktop) =>
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

  getBookingSortedForNextWeek(): Booking[] {
    const dateWeek = new Date();
    dateWeek.setDate(dateWeek.getDate() + 6);
    const day = new Date();
    day.setHours(0);
    day.setMinutes(0);
    day.setHours(0);
    day.setSeconds(0);
    const res = this.desktopList()!
      .flatMap((desktop) => {
        const myRes = desktop.bookings
          .filter((booking) => booking.email === localStorage.getItem("email"))
          .filter(
            (booking) =>
              new Date(booking.date).getTime() < dateWeek.getTime() &&
              new Date(booking.date).getTime() >= day.getTime()
          )
          .sort(
            (a, b) =>
              new Date(a?.date!).getTime() - new Date(b?.date!).getTime()
          );
        return myRes;
      })
      .filter((bookingMap) => bookingMap != null)
      .filter((x) => {
        console.log("x", x);
        return x;
      });
    return res;
  }
}
