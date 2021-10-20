import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showInfo(message: string, actionBtnLabel: string) {
    this.snackBar.open(message, actionBtnLabel);
  }
}
