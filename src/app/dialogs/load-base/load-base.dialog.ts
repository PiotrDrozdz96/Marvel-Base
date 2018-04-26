import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-load-base',
  templateUrl: './load-base.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class LoadBaseDialog {

  constructor(
    private dialogRef: MatDialogRef<LoadBaseDialog>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { this.data = {}; }

  openFile(event) {
    const input = event.target;
    const reader = [];
    const data = this.data;
    for (let i = 0; i < input.files.length; i++) {
      reader[i] = new FileReader();
      reader[i].readAsText(input.files[i]);
      reader[i].onload = function () {
        data[input.files[i].name] = JSON.parse(reader[i].result);
      };
    }
  }

}
