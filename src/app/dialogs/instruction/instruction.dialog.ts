import { Component} from '@angular/core';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-instruction-dialog',
  templateUrl: './instruction.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class InstructionDialog {

  constructor( private dialogRef: MatDialogRef<InstructionDialog>) {}

}
