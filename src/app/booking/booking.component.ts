import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";

@Component({
  selector: "app-booking",
  imports: [MatCardModule, MatDatepickerModule],
  templateUrl: "./booking.component.html",
  styleUrl: "./booking.component.scss",
})
export class BookingComponent {}
