// list-task.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.html',
  styleUrls: ['./list-task.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon, MatChip],
})
export class ListTask {
  constructor(
    public dialogRef: MatDialogRef<ListTask>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
