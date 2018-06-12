import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';

import { MarvelElement } from '../../models/elements';

import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';
import { AddElementDialog } from '../../dialogs/add-element/add-element.dialog';
import { GrabElementsDialog } from '../../dialogs/grab-elements/grab-elements.dialog';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-generator-issues',
  templateUrl: './generator-issues.component.html'
})
export class GeneratorIssuesComponent implements OnInit {

  elements: Array<MarvelElement>;
  series: Array<string>;
  selectedSeries: string;

  constructor(
    private generatorService: GeneratorService,
    private seriesService: SeriesService,
    private categoriesService: CategoriesService,
    private baseService: BaseService,
    private dialog: MatDialog
  ) {
    seriesService.get().subscribe(series => {
      categoriesService.getSelectedSeries().subscribe(selectedSeries => {
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

  add(index: number) {
    const dialogRef = this.dialog.open(AddElementDialog, { width: '360px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'singleElement') {
        const singleElementDialogRef = this.dialog.open(EditElementDialog, {
          data: {
            title: 'title',
            subTitle: 'subTtitle',
            publishedDate: 'publishedDate',
            id: '',
            volume: '',
            number: '',
            cover: '',
            series: [this.selectedSeries]
          }
        });
        singleElementDialogRef.afterClosed().subscribe(newElement => {
          this.generatorService.tryAddElement(newElement, index, 'zeszyty', this.series);
        });
      } else if (result === 'grabElements') {
        const grabElementsDialogRef = this.dialog.open(GrabElementsDialog);
        grabElementsDialogRef.afterClosed().subscribe(newElements => {
          this.generatorService.tryAddElements(
            newElements.map(element => Object.assign(element, { series: [this.selectedSeries] })),
            index, this.series);
        });
      }
    });
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
