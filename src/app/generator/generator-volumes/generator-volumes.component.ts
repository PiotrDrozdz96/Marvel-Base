import { Component, Renderer2 } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';

import { listToMatrix } from '../../functions/listToMatrix';

import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { CategoriesService } from '../../services/categories.service';
import { BaseService } from '../../services/base.service';
import { WindowService } from '../../services/window.service';

import { GeneratorIssuesComponent } from '../generator-issues/generator-issues.component';

import { MarvelElement } from '../../models/elements';


@Component({
  selector: 'app-generator-volumes',
  templateUrl: './generator-volumes.component.html'
})
export class GeneratorVolumesComponent extends GeneratorIssuesComponent {

  type = 'tomy';
  issuesElements: Array<MarvelElement>;
  childElements: Array<Array<MarvelElement>> = undefined;
  unpackElement: MarvelElement;
  selectedSeries: string;
  unpackSubscriber;

  constructor(
    public renderer: Renderer2,
    public generatorService: GeneratorService,
    public seriesService: SeriesService,
    public categoriesService: CategoriesService,
    public baseService: BaseService,
    public windowService: WindowService,
    public dialog: MatDialog
  ) {
    super(renderer, generatorService, seriesService, categoriesService, baseService, windowService, dialog);
    seriesService.get().subscribe(series => {
      categoriesService.getSelectedSeries().subscribe(selectedSeries => {
        if (series[selectedSeries]) {
          this.series = series[selectedSeries].tomy;
          this.selectedSeries = selectedSeries;

          windowService.getCountElements().subscribe(numberIssuesOnRow => {
            this.numberIssuesOnRow = numberIssuesOnRow;
            baseService.get(series[selectedSeries].tomy).subscribe(elements => {
              if (numberIssuesOnRow > 2) {
                this.matrixElements = listToMatrix(elements, numberIssuesOnRow);
              } else { this.matrixElements = [elements]; }
            });
            baseService.get(series[selectedSeries].zeszyty).subscribe(elements => {
              this.issuesElements = elements;
            });
          });
        } else {
          this.matrixElements = [];
          this.issuesElements = [];
        }
      });
    });
  }

  unpack(element: MarvelElement) {
    this.unpackElement = element;
    this.unpackSubscriber =  this.baseService.get(element.children).subscribe(elements => {
      this.childElements = listToMatrix(elements, this.numberIssuesOnRow);
    });
    this.blurOff();
  }

  pack() {
    this.childElements = undefined;
    this.unpackElement = undefined;
    this.unpackSubscriber.unsubscribe();
  }

  dropIssues(event: CdkDragDrop<string[]>) {
    this.drop(event);
    if (event.previousContainer === event.container &&
      event.previousIndex === event.currentIndex) {
      this.activeElement = document.getElementById(event.container.id).children[event.currentIndex].children[1];
      this.renderer.removeAttribute(this.activeElement, 'hidden');
      this.renderer.removeAttribute(document.getElementById('blur'), 'hidden');
      } else {
      this.unpackElement.children = [].concat(...this.childElements).map(e => e.id);
      this.baseService.update(this.unpackElement.id, this.unpackElement);
      this.unpack(this.unpackElement);
      this.previousRowIndex = this.currentRowIndex = 0;
    }
  }

  addChild(element: MarvelElement) {
    if (this.unpackElement.children.find(id => id === element.id)) {
      alert('Element znajduje się już na liście');
    } else {
      this.unpackElement.children.push(element.id);
      // this.setSeriesInUnpackElement(element);
      this.baseService.update(this.unpackElement.id, this.unpackElement);
    }
  }

  removeChild(index: number) {
    this.unpackElement.children.splice(index, 1);
    this.baseService.update(this.unpackElement.id, this.unpackElement);
    this.blurOff();
  }

  // setSeriesInUnpackElement(element?: MarvelElement) {
  //   this.unpackElement.series = this.childElements.concat(element || []).reduce(
  //     (total, current) => !total.find(c => c === current.series[0]) ?
  //       total.concat(current.series[0]) : total
  //     , []);
  // }

}
