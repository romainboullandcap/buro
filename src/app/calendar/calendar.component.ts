import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import {
  DateRange,
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { CommonModule } from "@angular/common";
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { DesktopService } from "../service/desktop.service";
import { Desktop } from "../model/desktop";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BookingService } from "../service/booking.service";

import { DateTime } from "luxon";

@Component({
  selector: "app-calendar",
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  templateUrl: `calendar.component.html`,
  styleUrl: `calendar.component.scss`,

  encapsulation: ViewEncapsulation.None,
})
/**
 * Grosse bidouille pour gérer la multiselection sur le mat-calendar (pas supporté nativement)
 */
export class CalendarComponent {
  @Input() _selectedDate!: Date;
  public set selectedDate(date: Date) {
    console.log("[Calendar] set selectedDate", date);
    this._selectedDate = date;
    this.updateSelectedDate(date);
    console.log("[Calendar] get selectedDate", this.selectedDate);
    this.refreshCalendarSelection();
  }
  public get selectedDate() {
    return this._selectedDate;
  }
  dateAdapter = inject(DateAdapter<Date>);
  desktopService = inject(DesktopService);
  bookingService = inject(BookingService);

  @Output() _selectedDateChange = new EventEmitter<Date>();
  updateSelectedDate(date: Date): void {
    console.log("[Calendar]  emit _selectedDateChange", date);
    this._selectedDateChange.emit(date);
  }

  _isMultipleDateSelection = false;

  public set isMultipleDateSelection(b: boolean) {
    this._isMultipleDateSelection = b;
    if (this._isMultipleDateSelection && this.selectedDesktop!.id == -1) {
      const desk: Desktop = {
        id: -2,
        angle: 0,
        bookings: [],
        name: "",
        xCoord: 1,
        yCoord: 1,
      };
      this.desktopService.setSelectedDesktop(desk);
    } else {
    }
  }
  public get isMultipleDateSelection() {
    return this._isMultipleDateSelection;
  }
  _selectedDateList: Date[] = [];
  public set selectedDateList(dateList: Date[]) {
    this._selectedDateList = dateList;
  }

  public get selectedDateList() {
    return this._selectedDateList;
  }

  calendarClickTimer = false;

  isFirstClick = false; // inutile maintenant ?
  _selectedDesktop: Desktop | undefined;
  public set selectedDesktop(d: Desktop | undefined) {
    this._selectedDesktop = d;
    this.dateAdapter.setLocale("fr");
  }

  public get selectedDesktop() {
    return this._selectedDesktop;
  }

  _snackBar = inject(MatSnackBar);

  constructor() {
    this.desktopService.selectedDesktopBS.subscribe(
      (v) => (this.selectedDesktop = v)
    );
    this.desktopService.refreshCalendarSelection$.subscribe((d) =>
      this.refreshCalendarSelection()
    );
  }
  ngAfterContentChecked(): void {
    this.setGridCellOnClick();
  }
  ngAfterViewInit(): void {
    this.setGridCellOnClick();
  }

  setGridCellOnClick() {
    const cellList = document.getElementsByClassName(
      "mat-calendar-body-cell-container"
    );
    //console.log("cellList", cellList.length);
    Array.prototype.forEach.call(cellList, (testElement: HTMLElement) => {
      testElement!.onclick = (ev: MouseEvent) => {
        console.log(
          "date parse",
          DateTime.fromFormat(
            testElement.firstElementChild?.attributes[4].value!,
            "dd MMMM yyyy",
            { locale: "fr" }
          ).toString()
        );
        this.cellOnClick(
          +testElement.attributes[2].value,
          +testElement.attributes[3].value,
          DateTime.fromFormat(
            testElement.firstElementChild?.attributes[4].value!,
            "dd MMMM yyyy",
            { locale: "fr" }
          )
        );
      };
    });
  }

  selectedDateRange: DateRange<Date | null> = new DateRange(null, null);

  _onSelectedChange(date: any): void {
    console.log("click", date);

    this.calendarClickTimer = true;
    if (this.isMultipleDateSelection) {
      if (!this.hasDate(date)) {
        //console.log("new date");
        this.selectedDateList.push(date);
      } else {
        this.selectedDateList.splice(
          this.selectedDateList.findIndex(
            (x) => x.getTime() === date.getTime()
          ),
          1
        );
      }
      this.refreshCalendarSelection();
      this.setGridCellOnClick();
    }
    setTimeout(() => (this.calendarClickTimer = false), 200);
  }

  hasDate(inputDate: Date) {
    return this.selectedDateList.some(
      (date) => date.getTime() === inputDate.getTime()
    );
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === "month") {
      if (
        cellDate.getTime() == this.selectedDate.getTime() &&
        !this.isMultipleDateSelection
      ) {
        return "selected-date";
      } else if (this.hasDate(cellDate)) {
        return "booked-date";
      }
    }
    return "";
  };

  cellOnClick(rowIndex: number, columnIndex: number, clickedDate: DateTime) {
    //this.updateSelectedDate(this.selectedDate);
    console.log("cellOnClick", this.selectedDate);
    if (
      columnIndex == 5 ||
      columnIndex == 6 ||
      (rowIndex == 0 && columnIndex == 0) || // cas bizarre premier samedi et dimanche
      (rowIndex == 0 && columnIndex == 1)
    )
      return; // click samedi/dimanche
    // gérer le click sur les dates disabled à la main
    if (!this.isBookingAvailable(clickedDate.toJSDate())) return;

    console.log("selectedDateList", this.selectedDateList);
    if (!this.calendarClickTimer && this.isMultipleDateSelection) {
      if (this.isFirstClick) {
        this.isFirstClick = false;
        // ajouter la date actuelle à la selection
        this.selectedDateList.push(this.selectedDate);
        console.log(
          "first click add",
          this.selectedDateList.map((d) => d.getTime())
        );
      } else {
        console.log("test", this.selectedDate);
        const index = this.selectedDateList.findIndex(
          (x) => x.getTime() === this.selectedDate.getTime()
        );
        if (index != -1) {
          //console.log("dans");
          // si la date cliquée est dans la sélection
          this.selectedDateList.splice(
            this.selectedDateList.findIndex(
              (x) => x.getTime() === this.selectedDate.getTime()
            ),
            1
          );
        } else {
          // ajouter la date a la selection
          this.selectedDateList.push(this.selectedDate);
        }
      }

      // refresh calendar
      setTimeout(() => {
        this.dateAdapter.setLocale("fr");
        this.setGridCellOnClick();
      });

      console.log("refresh");
    }
  }

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    if (day === 0 || day === 6) return false;
    const start = new Date();
    start.setHours(0);
    start.setMinutes(0);
    start.setHours(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    if (!d) return true;
    if (d.getTime() < start.getTime()) return false;
    return true;
  };

  isBookingAvailable(date: Date) {
    // pas a jour lors apres un create
    return !this.bookingService.hasBookingForDate(
      date,
      localStorage.getItem("email")!
    );
  }

  onIsMultipleDateChange($event: MatSlideToggleChange) {
    this.isMultipleDateSelection = !this.isMultipleDateSelection;

    this.desktopService.isMultipleDateSelection$.next(
      this.isMultipleDateSelection
    );
    if (!this.isMultipleDateSelection) {
      this.selectedDateList = [];
    }
    this.refreshCalendarSelection();
  }

  bookMultiple() {
    this.desktopService
      .bookDateList(
        this.selectedDesktop!.id,
        localStorage.getItem("email"),
        this.selectedDateList.map((d) => {
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
          d.setMilliseconds(0);
          return d;
        })
      )
      .subscribe({
        next: () => {
          this.selectedDateList = [];
          this._snackBar.open("Réservation effectuée", "Masquer", {
            duration: 1000,
          });
          this.desktopService
            .getAllDesktop()
            .subscribe((d) => this.refreshCalendarSelection());
        },
        error: (error) => {
          this.selectedDateList = [];
          this.refreshCalendarSelection();
        },
      });
  }

  refreshCalendarSelection() {
    console.log("refreshCalendarSelection");
    this.dateAdapter.setLocale("fr");
  }
}
