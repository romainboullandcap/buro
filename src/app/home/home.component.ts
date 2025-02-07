import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DesktopComponent } from "../desktop/desktop.component";
import { Desktop } from "../model/desktop";
import { DesktopService } from "../service/desktop.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DateRange,
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import { ReactiveFormsModule } from "@angular/forms";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { BookingService } from "../service/booking.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FloorplanComponent } from "../floorplan/floorplan.component";
import { DesktopDetailComponent } from "../desktop-detail/desktop-detail.component";

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FloorplanComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: `home.component.html`,
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements AfterViewInit {
  desktopList = signal<Desktop[]>([]);
  desktopService: DesktopService = inject(DesktopService);
  bookingService: BookingService = inject(BookingService);
  _snackBar = inject(MatSnackBar);
  selectedDate: Date = new Date();

  constructor() {
    this.loadData();
  }
  ngAfterViewInit(): void {}

  selectedDateRange: DateRange<Date | null> = new DateRange(null, null);

  _onSelectedChange(date: any): void {
    if (
      date &&
      this.selectedDateRange &&
      this.selectedDateRange.start &&
      date > this.selectedDateRange.start &&
      !this.selectedDateRange.end
    ) {
      this.selectedDateRange = new DateRange(
        this.selectedDateRange.start,
        date
      );
    } else {
      this.selectedDateRange = new DateRange(date, null);
    }
  }

  loadData() {
    console.log("loadData");
    this.desktopService.getAllDesktop().subscribe((desktopList: Desktop[]) => {
      this.desktopList.set(desktopList);
    });
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    console.log("dateClass");
    if (
      view === "month" &&
      this.selectedDateRange.start &&
      this.selectedDateRange.end
    ) {
      console.log("this.selectedDateRange", this.selectedDateRange);
      console.log("this.start", this.selectedDateRange.start.getTime());
      console.log("this.end", this.selectedDateRange.end.getTime());
      console.log("cellDate", cellDate.getTime());
      return cellDate.getTime() >= this.selectedDateRange.start.getTime() &&
        cellDate.getTime() <= this.selectedDateRange.end.getTime()
        ? "booked-date"
        : "";
    }
    return "";
  };
}
