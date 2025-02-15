import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENV } from "../env";
import { Booking } from "../model/booking";
import { Desktop } from "../model/desktop";
import { DesktopService } from "./desktop.service";
import { DESKTOP_STATE } from "../const";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  http = inject(HttpClient);
  desktopService = inject(DesktopService);
  list: Desktop[] = [];
  constructor() {
    this.desktopService.desktopList$.subscribe((d) => {
      this.list = d;
    });
  }

  deleteBooking(booking: Booking) {
    return this.http.delete(`${ENV.API_URL}/booking/${booking.id}`);
  }

  getBookingsForDateAndDesktop(
    bookings: Booking[],
    selectedDate: Date | undefined
  ): Booking[] {
    if (selectedDate) {
      const result = bookings.filter((d) =>
        BookingService.dateFilterPredicate(d, selectedDate)
      );
      return result;
    } else {
      return bookings;
    }
  }

  static dateFilterPredicate = (booking: Booking, date: Date) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0);
    const eventBookingDate = new Date(date);
    eventBookingDate.setHours(0, 0);
    return bookingDate.toDateString() === eventBookingDate.toDateString();
  };

  isMyBooking(booking: Booking) {
    return localStorage.getItem("email") === booking.email;
  }

  getDesktopState(
    desktop: Desktop,
    selectedDate: Date | undefined
  ): DESKTOP_STATE {
    const bookingForDesktop = this.getBookingsForDateAndDesktop(
      desktop.bookings,
      selectedDate
    );
    if (bookingForDesktop.length > 0) {
      if (bookingForDesktop.some(this.isMyBooking)) {
        return DESKTOP_STATE.BOOKED_FOR_ME;
      } else {
        return DESKTOP_STATE.BOOKED;
      }
    } else {
      return DESKTOP_STATE.AVAILABLE;
    }
  }

  hasBookingForDate(date: Date | undefined, email: string) {
    return this.list.some((desktop) =>
      desktop.bookings.some((booking) => {
        const bookDate = new Date(booking.date);
        return (
          bookDate.toDateString() === date?.toDateString() &&
          booking.email === email
        );
      })
    );
  }
}
