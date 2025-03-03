import { inject, Injectable } from "@angular/core";
import { Desktop } from "../model/desktop";
import { ENV } from "../env";
import { HttpClient } from "@angular/common/http";
import { Booking } from "../model/booking";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { SnackbarService } from "./snackbar.service";
import { ApiService } from "./api.service";
import { DateTime } from "luxon";

@Injectable({
  providedIn: "root",
})
export class DesktopService extends ApiService {
  http = inject(HttpClient);

  selectedDesktopBS = new BehaviorSubject<Desktop>({
    id: -1,
    angle: 0,
    bookings: [],
    name: "",
    xCoord: 1,
    yCoord: 1,
  });
  selectedDesktop$ = this.selectedDesktopBS.asObservable();

  selectedDesktopBookingBS = new BehaviorSubject<Desktop>({
    id: -1,
    angle: 0,
    bookings: [],
    name: "",
    xCoord: 1,
    yCoord: 1,
  });
  selectedDesktopBooking$ = this.selectedDesktopBookingBS.asObservable();

  desktopListBS = new BehaviorSubject<Desktop[]>([]);
  desktopList$ = this.desktopListBS.asObservable();

  isMultipleDateSelection$ = new BehaviorSubject<boolean>(false);
  refreshCalendarSelection$ = new BehaviorSubject<void>(undefined);

  constructor() {
    super();
  }

  // récupère les données depuis l'API et met à jour l'observable desktopList$
  loadAllDesktop() {
    this.http.get<Desktop[]>(`${ENV.API_URL}/desktop`).subscribe(
      (data) => {
        data.forEach((desktop) =>
          desktop.bookings.forEach((booking) => {
            booking.date = DateTime.fromISO(booking.date.toString()).startOf(
              "day"
            );
          })
        );
        if (
          this.selectedDesktopBS.value.id &&
          this.selectedDesktopBS.value.id != -1
        ) {
          this.setSelectedDesktop(
            data.find(
              (desktop) => desktop.id === this.selectedDesktopBS.value.id
            )!
          );
        }
        console.log("next desktopListBS", data);
        this.desktopListBS.next(data);
      },
      (error) => this.handleErrorObs(error)
    );
  }

  bookDesktop(
    desktopId: number,
    email: string | null,
    date: DateTime | undefined
  ) {
    date?.startOf("day");
    return this.http
      .post(`${ENV.API_URL}/desktop/book`, {
        email: email,
        desktopId: desktopId,
        date: date,
      })
      .pipe(catchError((error) => this.handleErrorObs(error)));
  }

  bookDateList(
    desktopId: number,
    dateList: DateTime[] | undefined
  ): Observable<Booking[]> {
    return this.http
      .post<Booking[]>(`${ENV.API_URL}/desktop/bookList`, {
        desktopId: desktopId,
        dateList: dateList?.map((date) => this.getDatePart(date)), // le back attend une string représentant la date uniquement
      })
      .pipe(catchError((error) => this.handleErrorObs(error)));
  }

  // i hate date handling in js
  getDatePart(date: DateTime): string | null {
    return date.toISODate();
  }

  setSelectedDesktop(desktop: Desktop) {
    this.selectedDesktopBS.next(desktop);
  }

  setSelectedDesktopBooking(desktop: Desktop) {
    this.selectedDesktopBookingBS.next(desktop);
  }
}
