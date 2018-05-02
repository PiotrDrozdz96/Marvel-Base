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
      const haveSubtitle = /(.+)Vol (\d+)  #(.+)(".*")\((.+)\)/.test(e.textContent);
      const description = haveSubtitle ?
        e.textContent.match(/(.+)Vol (\d+)  #(.+)(".*")\((.+)\)/) :
        e.textContent.match(/(.+)Vol (\d+)  #(.+)\((.+)\)/);
      return {
        title: description[1].trim(),
        volume: description[2],
        number: description[3],
        id: description[1].trim() + '_' + description[2] + '_' + description[3],
        subTitle: haveSubtitle ? description[4] : '',
        publishedDate: haveSubtitle ? description[5] : description[4],
        cover: images[i * 2]
      };
    });
    this.dialogRef.close(array);
  }

}
