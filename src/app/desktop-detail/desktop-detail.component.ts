import { Component, inject, input, output } from "@angular/core";
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
  ],
  templateUrl: "desktop-detail.component.html",
  styleUrl: "desktop-detail.component.scss",
})
export class DesktopDetailComponent {
  selectedDate = input<Date>();
  onDeleteDetail = output<void>();

  bookingService = inject(BookingService);
  desktopService = inject(DesktopService);
  _snackBar = inject(MatSnackBar);

  desktop = toSignal<Desktop>(this.desktopService.selectedDesktop$);

  DESKTOP_STATE = DESKTOP_STATE;

  isMultipleDateSelection = false;
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
        this.selectedDate()
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

  isCurrentDate(date: Date) {
    date = new Date(date);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  }

  isBookingAvailable() {
    return (
      this.bookingService.getDesktopState(
        this.desktop()!,
        this.selectedDate()
      ) === DESKTOP_STATE.AVAILABLE &&
      !this.bookingService.hasBookingForDate(
        this.selectedDate(),
        localStorage.getItem("email")!
      )
    );
  }

  isTodayBooking(booking: Booking) {
    if (this.selectedDate() !== undefined) {
      return (
        new Date(booking.date).getDate() === this.selectedDate()!.getDate() &&
        new Date(booking.date).getMonth() === this.selectedDate()!.getMonth() &&
        new Date(booking.date).getFullYear() ===
          this.selectedDate()!.getFullYear()
      );
    } else {
      return false;
    }
  }

  getTodayBooking() {
    return this.desktop()?.bookings.filter((x) => this.isTodayBooking(x));
  }

  getBookingSorted() {
    const dateWeek = new Date();
    dateWeek.setDate(dateWeek.getDate() + 6);
    const res = this.desktop()!
      .bookings.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .filter(
        (booking) => new Date(booking.date).getTime() < dateWeek.getTime()
      );
    console.log("res", res);
    return res.slice();
  }
}
