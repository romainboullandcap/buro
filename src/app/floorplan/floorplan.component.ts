import { Component, inject, input, output, signal } from "@angular/core";
import { Desktop } from "../model/desktop";
import { BookingService } from "../service/booking.service";
import { DesktopService } from "../service/desktop.service";
import { DESKTOP_STATE } from "../env";
import { toSignal } from "@angular/core/rxjs-interop";
import { DesktopDetailComponent } from "../desktop-detail/desktop-detail.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-floorplan",
  imports: [DesktopDetailComponent, MatSlideToggleModule, FormsModule],
  templateUrl: "floorplan.component.html",
  styleUrls: ["floorplan.component.css"],
})
export class FloorplanComponent {
  selectedDate = input<Date>();

  bookingService = inject(BookingService);
  desktopService = inject(DesktopService);
  getBookingsForDateAndDesktop =
    this.bookingService.getBookingsForDateAndDesktop;

  desktopList = input<Desktop[]>([]);

  selectedDesktop = toSignal(this.desktopService.selectedDesktop$);
  showText = false;
  showTextSignal = signal<boolean>(false);

  onDelete = output<void>();

  constructor() {}

  getFillColor(desktop: Desktop) {
    switch (this.bookingService.getDesktopState(desktop, this.selectedDate())) {
      case DESKTOP_STATE.AVAILABLE:
        return "#2a9d8f"; // disponible
      case DESKTOP_STATE.BOOKED:
        return "#e76f51"; // réservé par une autre personne
      case DESKTOP_STATE.BOOKED_FOR_ME:
        return "#e9c46a"; // réservé par l'utilisateur courant
    }
  }

  getStrokeColor(desktop: Desktop) {
    if (
      this.selectedDesktop() !== undefined &&
      this.selectedDesktop()!.id === desktop.id
    ) {
      return "#000";
    } else {
      return this.getFillColor(desktop);
    }
  }

  onDeskClick(desktop: Desktop) {
    this.desktopService.setSelectedDesktop(desktop);
  }

  onShowTextChange() {
    this.showTextSignal.set(this.showText);
  }

  onDeleteFromDetail() {
    this.onDelete.emit();
  }
}
