import {
  Component,
  inject,
  input,
  Input,
  output,
  WritableSignal,
} from "@angular/core";
import { Desktop } from "../model/desktop";
import { Booking } from "../model/booking";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BookingService } from "../service/booking.service";
import { DesktopService } from "../service/desktop.service";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-desktop",
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: "desktop.component.html",
  styleUrls: ["desktop.component.scss"],
})
export class DesktopComponent {
  desktop = input<Desktop>();
  @Input() selectedDate!: Date;
  onDelete = output<void>();

  desktopService: DesktopService = inject(DesktopService);
  bookingService: BookingService = inject(BookingService);
  _snackBar = inject(MatSnackBar);
  getBookingsForDateAndDesktop =
    this.bookingService.getBookingsForDateAndDesktop;
  isMyBooking = this.bookingService.isMyBooking;

  deleteBooking(booking: Booking) {
    this.bookingService.deleteBooking(booking).subscribe({
      next: (result) => {
        this._snackBar.open("Deleted");
        this.onDelete.emit();
      },
    });
  }

  bookDesktop(desktopId: number) {
    this.desktopService
      .bookDesktop(desktopId, localStorage.getItem("email"), this.selectedDate)
      .subscribe({
        next: () => {
          this._snackBar.open("Réservation effectuée", "Masquer", {
            duration: 1000,
          });
          this.onDelete.emit();
        },
      });
  }
}
