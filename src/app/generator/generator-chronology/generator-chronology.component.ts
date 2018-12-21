import { Component, OnInit, Renderer2 } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { BaseService } from '../../services/base.service';
import { ChronologyService } from '../../services/chronology.service';
import { SeriesService } from '../../services/series.service';
import { GeneratorService } from '../../services/generator.service';
import { CategoriesService } from '../../services/categories.service';
import { WindowService } from '../../services/window.service';

import { listToMatrix } from '../../functions/listToMatrix';

import { MarvelElement } from '../../models/elements';
import { GeneratorDragDrop } from '../generator-drag-drop';

@Component({
  selector: 'app-generator-chronology',
  templateUrl: './generator-chronology.component.html'
})
export class GeneratorChronologyComponent extends GeneratorDragDrop {

  matrixElements: Array<Array<MarvelElement>>;
  elements: Array<MarvelElement>;
  chronology: Array<string>;
  markerIndex: number;
  activeElement: Element;

  constructor(
    public renderer: Renderer2,
    public baseService: BaseService,
    public chronologyService: ChronologyService,
    public seriesService: SeriesService,
    public categoriesService: CategoriesService,
    public generatorService: GeneratorService,
    public windowService: WindowService,
  ) {
    super();
    windowService.getCountElements().subscribe(numberIssuesOnRow => {
      this.numberIssuesOnRow = numberIssuesOnRow;
      chronologyService.get().subscribe(chronology => {
        this.chronology = chronology;
        this.markerIndex = chronology.length;
        baseService.get(chronology).subscribe(elements => {
          this.matrixElements = listToMatrix(elements, numberIssuesOnRow);
        });
      });
    });
    seriesService.get().subscribe(series => {
      categoriesService.getSelectedSeries().subscribe(selectedSeries => {
        if (series[selectedSeries] && series[selectedSeries].tomy) {
          baseService.get(series[selectedSeries].tomy).subscribe(elements => {
            this.elements = elements;
          });
        }
      });
    });
  }

  dropAndUpdate(event: CdkDragDrop<string[]>) {
    this.drop(event);
    if (event.previousContainer === event.container &&
      event.previousIndex === event.currentIndex) {
      this.activeElement = document.getElementById(event.container.id).children[event.currentIndex].children[1];
      this.renderer.removeAttribute(this.activeElement, 'hidden');
      this.renderer.removeAttribute(document.getElementById('blur'), 'hidden');
    } else {
      this.chronologyService.set([].concat(...this.matrixElements).map(e => e.id));
      this.previousRowIndex = this.currentRowIndex = 0;
    }
  }

  blurOff() {
    if (document.getElementById('blur') !== undefined) {
      this.renderer.setAttribute(document.getElementById('blur'), 'hidden', 'true');
    }
    if (this.activeElement !== undefined) {
      this.renderer.setAttribute(this.activeElement, 'hidden', 'true');
      this.activeElement = undefined;
    }
  }

  trash(index: number) {
    this.chronology.splice(index, 1);
    this.chronologyService.set(this.chronology);
    this.blurOff();
  }

  mark(index: number) {
    this.markerIndex = index;
    this.blurOff();
  }

  addChild(element: MarvelElement) {
    if (this.chronology.find(e => e === element.id)) {
      alert('Element znajduje się już na liście');
    } else {
      const index = this.markerIndex;
      this.chronology.splice(this.markerIndex, 0, element.id);
      this.chronologyService.set(this.chronology);
      this.markerIndex = index + 1;
    }
  }

}
