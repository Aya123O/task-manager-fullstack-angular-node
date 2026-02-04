import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatIconModule, MatDialogActions, MatDialogContent],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialog>,
    public dialog: MatDialog,
  ) {}
  close() {
    this.dialogRef.close();


  }
  confirm() {
    this.dialog.closeAll();
  }
}
