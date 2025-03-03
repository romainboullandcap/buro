import { Component, computed, inject, input, output } from "@angular/core";
import { Desktop } from "../model/desktop";
import { BookingService } from "../service/booking.service";
import { Booking } from "../model/booking";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DesktopService } from "../service/desktop.service";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DESKTOP_STATE } from "../const";
import { BookingTableComponent } from "../booking-table/booking-table.component";
import { DateTime } from "luxon";

@Component({
  selector: "app-desktop-detail",
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    BookingTableComponent,
  ],
  templateUrl: "desktop-detail.component.html",
  styleUrl: "desktop-detail.component.scss",
})
export class DesktopDetailComponent {
  selectedDate = input<DateTime | undefined | null>();
  onDeleteDetail = output<void>();

  bookingService = inject(BookingService);
  desktopService = inject(DesktopService);
  _snackBar = inject(MatSnackBar);

  desktop = toSignal<Desktop>(this.desktopService.selectedDesktop$);

  DESKTOP_STATE = DESKTOP_STATE;

  isMultipleDateSelection = false;
  customEmptyMessage = "Aucune réservation pour la période";

  constructor() {
    this.desktopService.isMultipleDateSelection$.subscribe(
      (d) => (this.isMultipleDateSelection = d)
    );
  }

  onDeleteClick(booking: Booking) {
    this.bookingService.deleteBooking(booking).subscribe({
      next: (result) => {
        this._snackBar.open("Réservation supprimée", "Masquer", {
          duration: 1000,
        });
        this.onDeleteDetail.emit();
        this.desktopService.refreshCalendarSelection$.next();
      },
    });
  }

  bookDesktop(desktopId: number) {
    this.desktopService
      .bookDesktop(
        desktopId,
        localStorage.getItem("email"),
        this.selectedDate()!
      )
      .subscribe({
        next: () => {
          this._snackBar.open("Réservation effectuée", "Masquer", {
            duration: 1000,
          });
          this.onDeleteDetail.emit();
          this.desktopService.refreshCalendarSelection$.next();
        },
      });
  }

  isBookingAvailable() {
    return (
      this.bookingService.getDesktopState(
        this.desktop()!,
        this.selectedDate()!
      ) === DESKTOP_STATE.AVAILABLE &&
      !this.bookingService.hasBookingForDateAndCurrentUser(this.selectedDate()!)
    );
  }

  isTodayBooking(booking: Booking) {
    return (
      DateTime.now().hasSame(booking.date, "day") &&
      DateTime.now().hasSame(booking.date, "month") &&
      DateTime.now().hasSame(booking.date, "year")
    );
  }
  // selectedDate + 7J
  getBookingSortedForNextWeek() {
    console.log("getBookingSortedForNextWeek", this.selectedDate());
    if (this.selectedDate() != undefined) {
      let endDate = DateTime.fromJSDate(this.selectedDate()!.toJSDate());
      endDate.startOf("day");
      endDate = endDate.plus({ days: 8 });
      const res = this.desktop()!
        .bookings.sort((a, b) => a.date.diff(b.date).toMillis())
        .filter(
          (booking) =>
            booking.date < endDate && booking.date >= this.selectedDate()!
        );

      const ss = res.slice();
      console.log("ss", ss);
      return res;
    } else {
      return [];
    }
  }

  endSelectedDate = computed(() => {
    if (this.selectedDate() != undefined) {
      let endDate = DateTime.fromJSDate(this.selectedDate()!.toJSDate());
      endDate.startOf("day");
      endDate = endDate.plus({ days: 7 });
      return endDate;
    }
    return undefined;
  });
}
