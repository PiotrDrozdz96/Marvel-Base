import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';

import { MarvelElement } from '../../models/elements';

import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';
import { ConflictElementsDialog } from '../../dialogs/conflict-elements/conflict-elements.dialog';

@Component({
  selector: 'app-generator-issues',
  templateUrl: './generator-issues.component.html',
  styleUrls: ['./generator-issues.component.css']
})
export class GeneratorIssuesComponent implements OnInit {

  elements: Array<MarvelElement>;
  series: Array<string>;
  selectedSeries: string;

  constructor(
    private generatorService: GeneratorService,
    private seriesService: SeriesService,
    private baseService: BaseService,
    private dialog: MatDialog,
  ) {
    seriesService.get().subscribe(series => {
      generatorService.getSelectedSeries().subscribe(selectedSeries => {
        if (series[selectedSeries]) {
          this.series = series[selectedSeries].zeszyty;
          this.selectedSeries = selectedSeries;

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
    this.series.splice(index, 1);
    this.seriesService.update(this.selectedSeries, 'zeszyty', this.series);
    this.baseService.trash(element.id);
  }

  moveLeft(index: number) {
    if (index) {
      const removedElement = this.series.splice(index, 1);
      this.series.splice(index - 1, 0, ...removedElement);
      this.seriesService.update(this.selectedSeries, 'zeszyty', this.series);
    }
  }

  moveRight(index: number) {
    if (index < this.series.length) {
      const removedElement = this.series.splice(index, 1);
      this.series.splice(index + 1, 0, ...removedElement);
      this.seriesService.update(this.selectedSeries, 'zeszyty', this.series);
    }
  }

  tryReplaceElement(newElement: MarvelElement, index: number, element: MarvelElement) {
    if (newElement) {
      const conflictElement = this.baseService.update(element.id, newElement);
      if (conflictElement === undefined) {
        this.series[index] = newElement.id;
        this.seriesService.update(this.selectedSeries, 'zeszyty', this.series);
      } else {
        const dialogRef = this.dialog.open(ConflictElementsDialog, {
          data: {
            element: conflictElement,
            newElement: newElement
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.tryReplaceElement(result, index, element);
        });
      }
    }
  }

  edit(element: MarvelElement, index: number) {
    const dialogRef = this.dialog.open(EditElementDialog, { data: Object.assign({}, element) });
    dialogRef.afterClosed().subscribe(newElement => {
      this.tryReplaceElement(newElement, index, element);
    });
  }

}
