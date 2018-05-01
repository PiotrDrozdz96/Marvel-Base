import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';

import { MarvelElement } from '../../models/elements';

import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';

@Component({
  selector: 'app-generator-issues',
  templateUrl: './generator-issues.component.html',
  styleUrls: ['./generator-issues.component.css']
})
export class GeneratorIssuesComponent implements OnInit {

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
          this.series = series[selectedSeries].zeszyty;

          baseService.get(series[selectedSeries].zeszyty).subscribe(elements => {
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
    this.generatorService.trash(element.id, index, 'zeszyty', this.series);
  }

  move(index: number, way: number) {
    this.generatorService.move(index, 'zeszyty', this.series, way);
  }

  edit(element: MarvelElement, index: number) {
    const dialogRef = this.dialog.open(EditElementDialog, { data: Object.assign({}, element) });
    dialogRef.afterClosed().subscribe(newElement => {
      this.generatorService.tryReplaceElement(newElement, index, element, 'zeszyty', this.series);
    });
  }

}
