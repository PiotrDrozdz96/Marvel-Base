import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MarvelElement } from '../../models/elements';
import { EditElementComponent } from '../../element/edit-element.component';

@Component({
  selector: 'app-conflict-elements',
  templateUrl: './conflict-elements.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class ConflictElementsDialog {

  element: MarvelElement;
  newElement: MarvelElement;

  constructor(
    private dialogRef: MatDialogRef<ConflictElementsDialog>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.element = data.element;
    this.newElement = data.newElement;
   }

  closeDialog() {
    this.newElement.id = this.newElement.title + '_' + this.newElement.volume + '_' + this.newElement.number;
    this.dialogRef.close(this.newElement);
  }

}
