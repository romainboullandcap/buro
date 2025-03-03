/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, LOCALE_ID } from "@angular/core";
import { provideProtractorTestingSupport } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import routeConfig from "./routes";
import { errorSnackbarInterceptor } from "./error-snackbar.interceptor";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from "@angular/material/core";
import { tokenInterceptor } from "./token.interceptor";
import {
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  DefaultMatCalendarRangeStrategy,
} from "@angular/material/datepicker";
import { provideLuxonDateAdapter } from "@angular/material-luxon-adapter";

export const MY_FORMATS = {
  parse: {
    dateInput: "dd",
  },
  display: {
    dateInput: "EEEE d MMMM",
    monthYearLabel: "MMM y",
    dateA11yLabel: "dd",
    monthYearA11yLabel: "dd YYYY",
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideProtractorTestingSupport(),
    provideRouter(routeConfig),
    provideHttpClient(
      withInterceptors([errorSnackbarInterceptor, tokenInterceptor])
    ),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
    { provide: LOCALE_ID, useValue: "fr-FR" },
    provideNativeDateAdapter(),

    provideLuxonDateAdapter(MY_FORMATS),
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
};
