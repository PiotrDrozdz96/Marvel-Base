import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MarvelElement } from '../../models/elements';
import { EditElementComponent } from '../../element/edit-element.component';

@Component({
  selector: 'app-edit-element-dialog',
  templateUrl: './edit-element.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class EditElementDialog {

  constructor(
    private dialogRef: MatDialogRef<EditElementDialog>,
    @Inject(MAT_DIALOG_DATA) public element: MarvelElement
  ) { }

  closeDialog() {
    this.element.id = (this.element.title + '_' + this.element.volume + '_' + this.element.number)
      .replace(/ /g, '_');
    this.dialogRef.close(this.element);
  }

}
