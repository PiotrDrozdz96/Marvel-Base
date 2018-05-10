import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-element-dialog',
  templateUrl: './add-element.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class AddElementDialog {

  constructor( private dialogRef: MatDialogRef<AddElementDialog> ) { }

}
