import { CommonModule } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Booking } from "../model/booking";
import { BookingService } from "../service/booking.service";
import { MatIconModule } from "@angular/material/icon";
import { DesktopService } from "../service/desktop.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { UserService } from "../service/user.service";

@Component({
  selector: "app-booking-table",
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: "./booking-table.component.html",
  styleUrl: "./booking-table.component.scss",
})
export class BookingTableComponent {
  bookingService = inject(BookingService);
  desktopService = inject(DesktopService);
  _snackBar = inject(MatSnackBar);
  userService = inject(UserService);

  bookingList = input<Booking[]>([]);
  isDesktopDetailMode = input<boolean>(false);
  customEmptyMessage = input<string>();

  onDeleteClick(booking: Booking) {
    this.bookingService.deleteBooking(booking).subscribe({
      next: (result) => {
        this._snackBar.open("Réservation supprimée", "Masquer", {
          duration: 3000,
        });
        this.desktopService.loadAllDesktop();
      },
    });
  }
}
