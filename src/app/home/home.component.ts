import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DesktopService } from "../service/desktop.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FloorplanComponent } from "../floorplan/floorplan.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { AgendaComponent } from "../agenda/agenda.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { LoginService } from "../service/login.service";
import { DateAdapter } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { Moment } from "moment";
import { DateTime } from "luxon";

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
    AgendaComponent,
  ],
  providers: [],
  templateUrl: `home.component.html`,
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  desktopService: DesktopService = inject(DesktopService);
  loginService: LoginService = inject(LoginService);
  dateAdapter = inject(DateAdapter<DateTime>);
  formBuilder = inject(FormBuilder);

  desktopList = toSignal(this.desktopService.desktopList$);

  dateSelectionForm = this.formBuilder.group({
    selectedDateCalendar: [DateTime.now().startOf("day"), Validators.required],
  });

  constructor() {
    this.dateAdapter.setLocale("fr");
    this.loginService.tryAuthWithToken();
    this.desktopService.loadAllDesktop();
    this.dateSelectionForm.controls.selectedDateCalendar.setValue(
      DateTime.now().startOf("day")
    );
  }

  loadData() {
    this.desktopService.loadAllDesktop();
  }

  onNextDayClick() {
    this.addDays(1);
  }

  onPreviousDayClick() {
    this.addDays(-1);
  }

  addDays(nbDays: number) {
    if (this.dateSelectionForm.controls.selectedDateCalendar) {
      var temp : DateTime = DateTime.fromJSDate(
        this.dateSelectionForm.controls.selectedDateCalendar.value!.toJSDate()
      );
      temp = temp.plus({ days: nbDays });
      this.dateSelectionForm.controls.selectedDateCalendar.setValue(temp);
    }
  }
}
