import { inject } from "@angular/core"
import { SnackbarService } from "./snackbar.service"
import { Observable, of } from "rxjs";

export class ApiService {

    snackBarService = inject(SnackbarService)

    handleError(error: any): void {
        this.snackBarService.open(`Erreur lors de la communication avec le serveur`)
    }

    handleErrorObs(error: any): Observable<any> {
        this.handleError(error);
        return of("");
    }
}