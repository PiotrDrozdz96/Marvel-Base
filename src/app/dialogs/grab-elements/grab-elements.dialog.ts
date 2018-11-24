import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditElementComponent } from '../../element/edit-element.component';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-grab-elements-dialog',
  templateUrl: './grab-elements.dialog.html'
})
// tslint:disable-next-line:component-class-suffix
export class GrabElementsDialog {

  pageString: string;

  constructor(private dialogRef: MatDialogRef<GrabElementsDialog>) { }

  grab() {
    const parser = new DOMParser();
    const page = parser.parseFromString(this.pageString, 'text/html');
    const images = Array.from(page.querySelectorAll('.wikia-gallery-item img.thumbimage'))
      .map(e => e.getAttribute('src'));
    const array = Array.from(page.querySelectorAll('.wikia-gallery-item')).map((e, i) => {
      const description = e.textContent.match(/(.+[^ V\d])( Vol )?(\d+)?( )?( )#([^"]+)(".*")?\((.+)\)/);
      return {
        title: description[1].trim(),
        volume: description[3] || '1',
        number: description[6],
        id: (description[1].trim() + '_' + (description[3] || '1') + '_' + description[6]).replace(/ /g, '_'),
        subTitle: (description[7] || '').trim(),
        publishedDate: description[8],
        cover: images[i * 2]
      };
    });
    this.dialogRef.close(array);
  }

}
