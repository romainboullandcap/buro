export const ENV: { API_URL: string } = {
  API_URL: process.env["API_URL"] || "http://localhost:3333",
};

export enum DESKTOP_STATE {
  AVAILABLE,
  BOOKED,
  BOOKED_FOR_ME,
}
