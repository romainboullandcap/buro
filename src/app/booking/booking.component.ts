import {
  Component,
  Inject,
  input,
  OnDestroy,
  viewChild,
  viewChildren,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { Desktop } from "../model/desktop";
import {
  AfterContentChecked,
  AfterViewInit,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DesktopService } from "../service/desktop.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DateRange,
  MatCalendarCellClassFunction,
} from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { BookingService } from "../service/booking.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FloorplanComponent } from "../floorplan/floorplan.component";
import { DateTime } from "luxon";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Booking } from "../model/booking";
import { BookingTableComponent } from "../booking-table/booking-table.component";
import { SnackbarService } from "../service/snackbar.service";
import * as luxon from "luxon";

@Component({
  selector: "app-booking",
  imports: [
    MatIconModule,
    BookingTableComponent,
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FloorplanComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./booking.component.html",
  styleUrl: "./booking.component.scss",
})
export class BookingComponent implements OnDestroy {
  dateAdapter = inject(DateAdapter<DateTime>);
  desktopService = inject(DesktopService);
  bookingService = inject(BookingService);

  stepper = viewChild<MatStepper>("stepper");

  _selectedDateList: DateTime[] = [];
  public set selectedDateList(dateList: DateTime[]) {
    this._selectedDateList = dateList;
  }

  public get selectedDateList() {
    return this._selectedDateList;
  }

  calendarClickTimer = false;

  isFirstClick = false; // inutile maintenant ?
  selectedDesktop!: Desktop;
  _snackBar = inject(MatSnackBar);

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ["", Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ["", Validators.required],
  });

  desktopList: Desktop[] = [];
  createdBookingList: Booking[] = [];

  isSaving = signal<boolean>(false);

  errorMessage: string | undefined;

  snackBarService = inject(SnackbarService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { desktopList: Desktop[] },
    public dialogRef: MatDialogRef<BookingComponent>
  ) {
    this.snackBarService.disable();
    this.desktopList = data.desktopList;
    // reset la selection précédente
    this.desktopService.selectedDesktopBookingBS.next({
      id: -1,
      angle: 0,
      bookings: [],
      name: "",
      xCoord: 1,
      yCoord: 1,
    });
    this.desktopService.selectedDesktopBooking$.subscribe((v) => {
      this.selectedDesktop = v;
      if (this.selectedDesktop.id != -1) {
        this.firstFormGroup.controls.firstCtrl.setValue("ok");
      }
      this.refreshCalendarSelection();
    });
    this.desktopService.refreshCalendarSelection$.subscribe((d) =>
      this.refreshCalendarSelection()
    );
    // reset la selection précédente
    this.desktopService.selectedDesktopBookingBS.next({
      id: -1,
      angle: 0,
      bookings: [],
      name: "",
      xCoord: 1,
      yCoord: 1,
    });
  }
  ngOnDestroy(): void {
    this.snackBarService.enable();
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
    Array.prototype.forEach.call(cellList, (testElement: HTMLElement) => {
      testElement!.onclick = (ev: MouseEvent) => {
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

  _onSelectedChange(date: DateTime | null): void {
    if (!date) return;
    this.calendarClickTimer = true;
    if (!this.hasDate(date)) {
      //console.log("new date");
      this.addSelectedDate(date);
    } else {
      this.selectedDateList.splice(
        this.selectedDateList.findIndex((x) => x.hasSame(date, "day") &&
        x.hasSame(date, "month") &&
        x.hasSame(date, "year")),
        1
      );
    }
    this.refreshCalendarSelection();
    this.setGridCellOnClick();
    setTimeout(() => (this.calendarClickTimer = false), 200);
  }
  addSelectedDate(date: DateTime) {
    console.log("add date", date);
    this.selectedDateList.push(date);
    this.selectedDateList = [...this.selectedDateList];
  }

  hasDate(inputDate: DateTime | null) {
    if (!inputDate) return false;
    return this.selectedDateList.some((date) =>
    date.hasSame(inputDate, "day") &&
    date.hasSame(inputDate, "month") &&
    date.hasSame(inputDate, "year"))
  }

  dateClass: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
    if (this.hasDate(cellDate) && view === "month") {
      return "booked-date";
    }
    return "";
  };

  cellOnClick(rowIndex: number, columnIndex: number, clickedDate: DateTime) {
    if (
      columnIndex == 5 ||
      columnIndex == 6 ||
      (rowIndex == 0 && columnIndex == 0) || // cas bizarre premier samedi et dimanche
      (rowIndex == 0 && columnIndex == 1)
    )
      return; // click samedi/dimanche
    // gérer le click sur les dates disabled à la main
    if (!this.isBookingAvailable(clickedDate)) return;
    // gérer un click lors du choix de mois
    if (!clickedDate.isValid) return;
    if (clickedDate < DateTime.now()) return;

    console.log("selectedDateList", this.selectedDateList);
    if (!this.calendarClickTimer) {
      if (this.isFirstClick) {
        this.isFirstClick = false;
        // ajouter la date actuelle à la selection
        this.addSelectedDate(clickedDate);
        console.log(
          "first click add",
          this.selectedDateList.map((d) => d)
        );
      } else {
        const index = this.selectedDateList.findIndex((x) => x == clickedDate);
        if (index != -1) {
          //console.log("dans");
          // si la date cliquée est dans la sélection
          this.selectedDateList.splice(
            this.selectedDateList.findIndex((x) => x == clickedDate),
            1
          );
          this.selectedDateList = [...this._selectedDateList];
        } else {
          // ajouter la date a la selection
          this.addSelectedDate(clickedDate);
        }
      }

      // refresh calendar
      setTimeout(() => {
        this.refreshCalendarSelection();
        this.setGridCellOnClick();
      });
    }
  }

/**
 * Renvoie vrai si la date peut être selectionnée
 * @param d date de la cellule
 * @returns 
 */
  dateFilter = (d: DateTime | null): boolean => {
    var day;
    if (d) {
      day = d.day;
    } else {
      day = new Date().getDay();
    }
    // Prevent Saturday and Sunday from being selected.
    if (day === 0 || day === 6) return false;
    if (!d) return true;
    // don't allow booking in the past
    if (d.startOf("day") < DateTime.now().startOf("day")) return false;
    if (!this.isBookingAvailable(d)) return false;
    return true;
  };

  isBookingAvailable(date: DateTime) {
    // pas a jour apres un create
    return (
      !this.bookingService.hasBookingForDateAndCurrentUser(date) &&
      !this.bookingService.hasBookingForDateAndDesktop(date, this.selectedDesktop.id)
    );
  }

  bookMultiple() {
    this.secondFormGroup.controls.secondCtrl.setValue("ok");
    this.stepper()?.next();
    this.isSaving.set(true);
    this.desktopService
      .bookDateList(this.selectedDesktop!.id, this.selectedDateList)
      .subscribe({
        next: (createdBookingList: Booking[]) => {
          console.log("created", createdBookingList);
          this.isSaving.set(false);
          this.selectedDateList = [];
          // reset la selection précédente
          this.desktopService.selectedDesktopBookingBS.next({
            id: -1,
            angle: 0,
            bookings: [],
            name: "",
            xCoord: 1,
            yCoord: 1,
          });
          this.firstFormGroup.reset();
          this.secondFormGroup.reset();
          this._snackBar.open("Réservation effectuée", "Masquer", {
            duration: 3000,
          });
          this.createdBookingList = createdBookingList
            .map((booking) => {
              booking.date = luxon.DateTime.fromISO(
                booking.date.toString()
              );
              return booking;
            })
            .sort((a, b) => a.date.toMillis() - b.date.toMillis());
          console.log("this.createdBookingList", this.createdBookingList);
          this.desktopService.loadAllDesktop();
        },
        error: (error) => {
          this.errorMessage = error.error;
          this.isSaving.set(false);
          this.selectedDateList = [];
          this.secondFormGroup.reset();
          this.refreshCalendarSelection();
        },
      });
  }

  refreshCalendarSelection() {
    this.dateAdapter.setLocale("fr");
  }

  isBookButtonDisabled(): unknown {
    const res =
      !this.selectedDesktop ||
      this.selectedDesktop.id === -1 || // nul
      this.selectedDesktop.id === -2 ||
      this.selectedDateList.length === 0;
    return res;
  }

  onCloseClick() {
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.selectedDateList = [];
    // reset la selection précédente
    this.desktopService.selectedDesktopBookingBS.next({
      id: -1,
      angle: 0,
      bookings: [],
      name: "",
      xCoord: 1,
      yCoord: 1,
    });
    this.dialogRef.close();
  }

  goFirstStep() {
    this.stepper()?.reset();
  }
}
