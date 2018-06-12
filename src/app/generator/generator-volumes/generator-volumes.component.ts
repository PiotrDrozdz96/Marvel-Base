import { Component, OnInit } from '@angular/core';
import { MarvelElement } from '../../models/elements';
import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';
import { MatDialog } from '@angular/material';
import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-generator-volumes',
  templateUrl: './generator-volumes.component.html'
})
export class GeneratorVolumesComponent implements OnInit {

  volumesElements: Array<MarvelElement>;
  issuesElements: Array<MarvelElement>;
  childElements: Array<MarvelElement> = undefined;
  unpackElement: MarvelElement;
  series: Array<string>;
  selectedSeries: string;
  unpackSubscriber;

  constructor(
    private generatorService: GeneratorService,
    private seriesService: SeriesService,
    private baseService: BaseService,
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {
    this.seriesService.get().subscribe(series => {
      this.categoriesService.getSelectedSeries().subscribe(selectedSeries => {
        this.selectedSeries = selectedSeries;
        if (series[selectedSeries]) {
          this.series = series[selectedSeries].tomy;

          this.baseService.get(series[selectedSeries].tomy).subscribe(elements => {
            this.volumesElements = elements;
          });
          this.baseService.get(series[selectedSeries].zeszyty).subscribe(elements => {
            this.issuesElements = elements;
          });
        }
      });
    });
  }

  ngOnInit() {
  }

  add(index: number) {
    const singleElementDialogRef = this.dialog.open(EditElementDialog, {
      data: {
        title: 'title',
        subTitle: 'subTtitle',
        publishedDate: 'publishedDate',
        id: '',
        volume: '',
        number: '',
        cover: '',
        series: [this.selectedSeries],
        children: []
      }
    });
    singleElementDialogRef.afterClosed().subscribe(newElement => {
      this.generatorService.tryAddElement(newElement, index, 'tomy', this.series);
    });
  }

  trash(element: MarvelElement, index: number) {
    this.generatorService.trash(element.id, index, 'tomy', this.series);
  }

  move(index: number, way: number) {
    this.generatorService.move(index, 'tomy', this.series, way);
  }

  edit(element: MarvelElement, index: number) {
    const dialogRef = this.dialog.open(EditElementDialog, { data: Object.assign({}, element) });
    dialogRef.afterClosed().subscribe(newElement => {
      this.generatorService.tryReplaceElement(newElement, index, element, 'tomy', this.series);
    });
  }

  unpack(element: MarvelElement) {
    this.unpackElement = element;
    this.unpackSubscriber =  this.baseService.get(element.children).subscribe(elements => {
      this.childElements = elements;
    });
  }

  pack() {
    this.childElements = undefined;
    this.unpackElement = undefined;
    this.unpackSubscriber.unsubscribe();
  }

  setSeriesInUnpackElement(element?: MarvelElement) {
    this.unpackElement.series = this.childElements.concat(element || []).reduce(
      (total, current) => !total.find(c => c === current.series[0]) ?
        total.concat(current.series[0]) : total
      , []);
  }

  addChild(element: MarvelElement) {
    if (this.unpackElement.children.find(id => id === element.id)) {
      alert('Element znajduje się już na liście');
    } else {
      this.unpackElement.children.push(element.id);
      this.setSeriesInUnpackElement(element);
      this.baseService.update(this.unpackElement.id, this.unpackElement);
    }
  }

  moveChild(index: number, way: number) {
    if (!way || (way < 0 && index) || (way > 0 && index < this.unpackElement.children.length)) {
      const removedElement = this.unpackElement.children.splice(index, 1);
      if (!way) { this.setSeriesInUnpackElement(); } else {
        this.unpackElement.children.splice(index + way, 0, ...removedElement);
      }
      this.baseService.update(this.unpackElement.id, this.unpackElement);
    }
  }

}
