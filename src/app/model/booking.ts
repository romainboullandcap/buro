import { DateTime } from "luxon";
import { User } from "./user";

export interface Booking {
  id: number;
  date: DateTime;
  createdAt: Date;
  updatedAt: Date;
  desktopId: number;
  userId : number;
  user : User;
}
