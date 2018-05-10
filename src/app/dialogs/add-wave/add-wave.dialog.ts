import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-wave-dialog',
  templateUrl: './add-wave.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class AddWaveDialog {

  private wave: string;
  private series: string;

  constructor(
    private dialogRef: MatDialogRef<AddWaveDialog>,
    @Inject(MAT_DIALOG_DATA) private data: Array<string>,
  ) {
    this.wave = data[0] || '';
    this.series = data[1] || '';
  }

  exit() {
    this.dialogRef.close({
      wave: this.wave,
      series: this.series
    });
  }
}
