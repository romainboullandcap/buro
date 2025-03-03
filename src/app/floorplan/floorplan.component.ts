import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { Desktop } from "../model/desktop";
import { BookingService } from "../service/booking.service";
import { DesktopService } from "../service/desktop.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { DesktopDetailComponent } from "../desktop-detail/desktop-detail.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import { DESKTOP_STATE } from "../const";
import { CommonModule } from "@angular/common";
import { DateTime } from "luxon";

@Component({
  selector: "app-floorplan",
  imports: [
    DesktopDetailComponent,
    MatSlideToggleModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: "floorplan.component.html",
  styleUrls: ["floorplan.component.css"],
})
export class FloorplanComponent {
  selectedDate = input<DateTime | undefined | null>();
  endSelectedDate = computed(() => {
    if (this.selectedDate() != undefined) {
      let endDate = DateTime.fromJSDate(this.selectedDate()!.toJSDate());
      endDate.startOf("day");
      endDate = endDate.plus({ days: 7 });
      return endDate;
    }
    return undefined;
  });
  isSelectionMode = input<boolean>(false);

  bookingService = inject(BookingService);
  desktopService = inject(DesktopService);

  desktopList = input<Desktop[] | undefined>([]);

  selectedDesktop = toSignal(this.desktopService.selectedDesktop$);
  selectedDesktopBooking = toSignal(
    this.desktopService.selectedDesktopBooking$
  );

  onDelete = output<void>();

  constructor() {}

  getFillColor(desktop: Desktop) {
    if (this.isSelectionMode()) {
      if (this.selectedDesktopBooking()?.id === desktop.id) return "#e9c46a";
      return "#2a9d8f";
    }
    switch (
      this.bookingService.getDesktopState(desktop, this.selectedDate()!)
    ) {
      case DESKTOP_STATE.AVAILABLE:
        return "#2a9d8f"; // disponible
      case DESKTOP_STATE.BOOKED:
        return "#e76f51"; // réservé par une autre personne
      case DESKTOP_STATE.BOOKED_FOR_ME:
        return "#e9c46a"; // réservé par l'utilisateur courant
    }
  }

  getStrokeColor(desktop: Desktop) {
    const deskt = this.isSelectionMode()
      ? this.selectedDesktopBooking()
      : this.selectedDesktop();
    if (deskt !== undefined && deskt!.id === desktop.id) {
      return "#ff0000";
    } else {
      return this.getFillColor(desktop);
    }
  }

  onDeskClick(desktop: Desktop) {
    if (this.isSelectionMode()) {
      this.desktopService.setSelectedDesktopBooking(desktop);
    } else {
      this.desktopService.setSelectedDesktop(desktop);
    }
  }

  onDeleteFromDetail() {
    this.onDelete.emit();
  }

  getXPos(x: number, id: number) {
    if (id < 10) {
      return x + 5;
    }
    return x;
  }
}
