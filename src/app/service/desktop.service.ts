import { inject, Injectable } from "@angular/core";
import { Desktop } from "../model/desktop";
import { ENV } from "../env";
import { HttpClient } from "@angular/common/http";
import { Booking } from "../model/booking";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DesktopService {
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

  desktopListBS = new BehaviorSubject<Desktop[]>([]);
  desktopList$ = this.desktopListBS.asObservable();

  constructor() {}

  getAllDesktop(): Observable<Desktop[]> {
    return this.http.get<Desktop[]>(`${ENV.API_URL}/desktop`).pipe(
      tap((data) => {
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
        this.desktopListBS.next(data);
      })
    );
  }

  async getHousingLocationById(id: number): Promise<Desktop | undefined> {
    const data = await fetch(`${ENV.API_URL}/desktop/${id}`);
    return (await data.json()) ?? {};
  }

  bookDesktop(desktopId: number, email: string | null, date: Date | undefined) {
    date?.setHours(0);
    date?.setMinutes(0);
    date?.setSeconds(0);
    return this.http.post(`${ENV.API_URL}/desktop/book`, {
      email: email,
      desktopId: desktopId,
      date: date,
    });
  }

  setSelectedDesktop(desktop: Desktop) {
    this.selectedDesktopBS.next(desktop);
  }
}
