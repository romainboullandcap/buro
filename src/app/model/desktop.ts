import { Booking } from "./booking";

export interface Desktop {
  id: number;
  name: string;
  bookings: Booking[];
  xCoord: number;
  yCoord: number;
  angle: number;
}
