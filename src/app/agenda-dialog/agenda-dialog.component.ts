import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  DateRange,
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { Desktop } from "../model/desktop";

@Component({
  selector: "app-agenda-dialog",
  imports: [MatButtonModule, MatDialogModule, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: `agenda-dialog.component.html`,
  styleUrl: `agenda-dialog.component.scss`,
  encapsulation: ViewEncapsulation.None,
})
export class AgendaDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AgendaDialogComponent>);
  desktopList: Desktop[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { desktopList: Desktop[] }
  ) {
    this.desktopList = data.desktopList;
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === "month") {
      return this.desktopList.some((desktop) =>
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
