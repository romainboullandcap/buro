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
  selectedDate = input<Date>();
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
      !this.bookingService.hasBookingForDateAndEmail(
        this.selectedDate(),
        localStorage.getItem("email")!
      )
    );
  }

  isTodayBooking(booking: Booking) {
    return (
      new Date(booking.date).getDate() === new Date().getDate() &&
      new Date(booking.date).getMonth() === new Date().getMonth() &&
      new Date(booking.date).getFullYear() === new Date().getFullYear()
    );
  }
  // selectedDate + 7J
  getBookingSortedForNextWeek() {
    if (this.selectedDate() != undefined) {
      const endDate = new Date(this.selectedDate()!);
      endDate.setDate(this.selectedDate()!.getDate() + 8);
      endDate.setHours(0);
      endDate.setMinutes(0);
      endDate.setHours(0);
      endDate.setSeconds(0);
      endDate.setMilliseconds(0);
      const res = this.desktop()!
        .bookings.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        .filter(
          (booking) =>
            new Date(booking.date).getTime() < endDate.getTime() &&
            new Date(booking.date).getTime() >= this.selectedDate()!.getTime()
        );
      return res.slice();
    } else {
      return [];
    }
  }

  endSelectedDate = computed(() => {
      if (this.selectedDate() != undefined) {
        const endDate = new Date(this.selectedDate()!);
        endDate.setDate(this.selectedDate()!.getDate() + 7);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setHours(0);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);
        return endDate;
      }
      return undefined;
    });
}
