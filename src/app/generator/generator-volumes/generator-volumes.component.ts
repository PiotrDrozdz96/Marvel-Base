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

  volumesElements: Array<MarvelElement>;
  issuesElements: Array<MarvelElement>;
  childElements: Array<MarvelElement> = [];
  unpackElement: MarvelElement;
  series: Array<string>;

  constructor(
    private generatorService: GeneratorService,
    private seriesService: SeriesService,
    private baseService: BaseService,
    private dialog: MatDialog
  ) {
    this.seriesService.get().subscribe(series => {
      this.generatorService.getSelectedSeries().subscribe(selectedSeries => {
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

  unpack(element: MarvelElement) {
    this.unpackElement = element;
    this.baseService.get(element.children).subscribe(elements => {
      this.childElements = elements;
    });
  }

  pack() {
    this.childElements = [];
    this.unpackElement = undefined;
  }

  setSeriesInUnpackElement(element?: MarvelElement) {
    this.unpackElement.series = this.childElements.concat(element || []).reduce(
      (total, current) => !total.find( c => c === current.series[0]) ?
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

  removeChild(index: number) {
    this.unpackElement.children.splice(index, 1);
    this.setSeriesInUnpackElement();
    this.baseService.update(this.unpackElement.id, this.unpackElement);
  }

  moveChildLeft(index: number) {
    if (index) {
      const removedElement = this.unpackElement.children.splice(index, 1);
      this.unpackElement.children.splice(index - 1, 0, ...removedElement);
      this.baseService.update(this.unpackElement.id, this.unpackElement);
    }
  }

  moveChildRight(index: number) {
    if (index < this.unpackElement.children.length) {
      const removedElement = this.unpackElement.children.splice(index, 1);
      this.unpackElement.children.splice(index + 1, 0, ...removedElement);
      this.baseService.update(this.unpackElement.id, this.unpackElement);
    }
  }

}
