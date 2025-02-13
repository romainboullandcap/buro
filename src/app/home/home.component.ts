import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Desktop } from "../model/desktop";
import { DesktopService } from "../service/desktop.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DateRange,
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter, provideNativeDateAdapter } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { BookingService } from "../service/booking.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FloorplanComponent } from "../floorplan/floorplan.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CalendarComponent } from "../calendar/calendar.component";
import { AgendaComponent } from "../agenda/agenda.component";

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FloorplanComponent,
    MatSlideToggleModule,
    FormsModule,
    CalendarComponent,
    AgendaComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: `home.component.html`,
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  desktopList = signal<Desktop[]>([]);
  desktopService: DesktopService = inject(DesktopService);

  _selectedDateCalendar!: Date;
  public set selectedDateCalendar(date: Date) {
    this._selectedDateCalendar = date;
    console.log(
      "[HOME] this._selectedDateCalendar",
      this._selectedDateCalendar
    );
  }
  public get selectedDateCalendar() {
    return this._selectedDateCalendar;
  }
  constructor() {
    this.loadData();
    this.selectedDateCalendar = new Date();
    this.selectedDateCalendar.setHours(0);
    this.selectedDateCalendar.setMinutes(0);
    this.selectedDateCalendar.setSeconds(0);
    this.selectedDateCalendar.setMilliseconds(0);
  }

  loadData() {
    this.desktopService.getAllDesktop().subscribe((desktopList: Desktop[]) => {
      this.desktopList.set(desktopList);
    });
  }
}
