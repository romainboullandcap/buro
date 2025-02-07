import { Component, inject, input, output } from "@angular/core";
import { Desktop } from "../model/desktop";
import { BookingService } from "../service/booking.service";
import { DESKTOP_STATE } from "../env";
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

  onDeleteClick(booking: Booking) {
    this.bookingService.deleteBooking(booking).subscribe({
      next: (result) => {
        this._snackBar.open("Réservation supprimée", "Masquer", {
          duration: 1000,
        });
        this.onDeleteDetail.emit();
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
}
