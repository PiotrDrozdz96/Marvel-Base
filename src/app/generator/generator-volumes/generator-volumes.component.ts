import { Component, OnInit } from '@angular/core';
import { MarvelElement } from '../../models/elements';
import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';
import { MatDialog } from '@angular/material';
import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';

@Component({
  selector: 'app-generator-volumes',
  templateUrl: './generator-volumes.component.html',
  styleUrls: ['./generator-volumes.component.css']
})
export class GeneratorVolumesComponent implements OnInit {

  elements: Array<MarvelElement>;
  series: Array<string>;

  constructor(
    private generatorService: GeneratorService,
    private seriesService: SeriesService,
    private baseService: BaseService,
    private dialog: MatDialog
  ) {
    seriesService.get().subscribe(series => {
      generatorService.getSelectedSeries().subscribe(selectedSeries => {
        if (series[selectedSeries]) {
          this.series = series[selectedSeries].tomy;

          baseService.get(series[selectedSeries].tomy).subscribe(elements => {
            this.elements = elements;
          });
        }
      });
    });
  }

  ngOnInit() {
  }

  add() {
    console.log('add');
  }

  trash(element: MarvelElement, index: number) {
    this.generatorService.trash(element.id, index, 'tomy', this.series);
  }

  moveLeft(index: number) {
    this.generatorService.moveLeft(index, 'tomy', this.series);
  }

  moveRight(index: number) {
    this.generatorService.moveRight(index, 'tomy', this.series);
  }

  edit(element: MarvelElement, index: number) {
    const dialogRef = this.dialog.open(EditElementDialog, { data: Object.assign({}, element) });
    dialogRef.afterClosed().subscribe(newElement => {
      this.generatorService.tryReplaceElement(newElement, index, element, 'tomy', this.series);
    });
  }

}
