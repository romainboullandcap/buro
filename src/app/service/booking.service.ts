import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ENV } from "../env";
import { Booking } from "../model/booking";
import { Desktop } from "../model/desktop";
import { DesktopService } from "./desktop.service";
import { DESKTOP_STATE } from "../const";
import { ApiService } from "./api.service";
import { catchError } from "rxjs";
import { LoginService } from "./login.service";
import { DateTime } from "luxon";

@Injectable({
  providedIn: "root",
})
export class BookingService extends ApiService {
  http = inject(HttpClient);
  desktopService = inject(DesktopService);
  loginService = inject(LoginService);

  list: Desktop[] = [];

  constructor() {
    super();
    this.desktopService.desktopList$.subscribe(
      (d) => {
        this.list = d;
      },
      (error) => this.handleErrorObs(error)
    );
  }

  deleteBooking(booking: Booking) {
    return this.http
      .delete<Booking>(`${ENV.API_URL}/booking/${booking.id}`)
      .pipe(catchError((error) => this.handleErrorObs(error)));
  }

  getBookingsForDate(
    bookings: Booking[],
    selectedDate: DateTime | undefined
  ): Booking[] {
    if (selectedDate) {
      console.log("bookings", bookings);
      const result = bookings.filter(
        (booking) =>
          booking.date.hasSame(selectedDate, "day") &&
          booking.date.hasSame(selectedDate, "month") &&
          booking.date.hasSame(selectedDate, "year")
      );
      return result;
    } else {
      return bookings;
    }
  }

  isMyBooking(booking: Booking) {
    return this.loginService.currentUser()?.id === booking.userId;
  }

  getDesktopState(
    desktop: Desktop,
    selectedDate: DateTime | undefined
  ): DESKTOP_STATE {
    const bookingForDesktop = this.getBookingsForDate(
      desktop.bookings,
      selectedDate
    );
    console.log("bookingForDesktop", desktop.id, bookingForDesktop);
    if (bookingForDesktop.length > 0) {
      if (bookingForDesktop.some((d) => this.isMyBooking(d))) {
        return DESKTOP_STATE.BOOKED_FOR_ME;
      } else {
        return DESKTOP_STATE.BOOKED;
      }
    } else {
      return DESKTOP_STATE.AVAILABLE;
    }
  }

  hasBookingForDateAndCurrentUser(date: DateTime) {
    return this.list.some((desktop) =>
      desktop.bookings.some((booking) => {
        return (
          booking.date.hasSame(date, "day") &&
          booking.date.hasSame(date, "month") &&
          booking.date.hasSame(date, "year") &&
          booking.userId === this.loginService.currentUser()?.id
        );
      })
    );
  }

  hasBookingForDateAndDesktop(date: DateTime, desktopId: number) {
    return this.list
      .find((desktop) => desktop.id == desktopId)
      ?.bookings.some((booking) => {
        return (
          booking.date.hasSame(date, "day") &&
          booking.date.hasSame(date, "month") &&
          booking.date.hasSame(date, "year")
        );
      });
  }
}
