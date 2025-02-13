import { Component, ViewEncapsulation, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { Desktop } from "../model/desktop";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-agenda",
  imports: [MatButtonModule, MatDatepickerModule, MatCardModule],
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
}
