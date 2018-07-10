import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MarvelElement } from '../../models/elements';
import { EditElementComponent } from '../../element/edit-element.component';

@Component({
  selector: 'app-conflict-grab-elements',
  templateUrl: './conflict-grab-elements.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class ConflictGrabElementsDialog {

  element: MarvelElement;
  newElement: MarvelElement;

  constructor(
    private dialogRef: MatDialogRef<ConflictGrabElementsDialog>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.element = data.element;
    this.newElement = data.newElement;
   }

  closeDialog(returned: boolean) {
    this.newElement.id = this.newElement.title + '_' + this.newElement.volume + '_' + this.newElement.number;
    this.dialogRef.close(returned ? this.newElement : false);
  }

}
