import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
  CdkDragDrop, CdkDragExit, CdkDragEnter,
  moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';

import { listToMatrix } from '../../functions/listToMatrix';

import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';
import { WindowService } from '../../services/window.service';

import { MarvelElement } from '../../models/elements';

import { EditElementDialog } from '../../dialogs/edit-element/edit-element.dialog';
import { AddElementDialog } from '../../dialogs/add-element/add-element.dialog';
import { GrabElementsDialog } from '../../dialogs/grab-elements/grab-elements.dialog';
import { CategoriesService } from '../../services/categories.service';
import { InstructionDialog } from '../../dialogs/instruction/instruction.dialog';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';



@Component({
  selector: 'app-generator-issues',
  templateUrl: './generator-issues.component.html'
})
export class GeneratorIssuesComponent implements OnInit {

  @ViewChild('base') baseRef: ElementRef;

  matrixElements: Array<Array<MarvelElement>>;
  elements: Array<MarvelElement>;
  series: Array<string>;
  selectedSeries: string;
  previousIndex: number;
  currentIndex: number;
  handle: boolean;
  numberIssuesOnRow = 1;

  constructor(
    private generatorService: GeneratorService,
    private seriesService: SeriesService,
    private categoriesService: CategoriesService,
    private baseService: BaseService,
    private windowService: WindowService,
    private dialog: MatDialog
  ) {
    seriesService.get().subscribe(series => {
      categoriesService.getSelectedSeries().subscribe(selectedSeries => {
        if (series[selectedSeries]) {
          this.series = series[selectedSeries].zeszyty;
          this.selectedSeries = selectedSeries;
          baseService.get(series[selectedSeries].zeszyty).subscribe(elements => {
            windowService.getCountElements().subscribe(numberIssuesOnRow => {
              this.numberIssuesOnRow = numberIssuesOnRow;
              if (numberIssuesOnRow > 2) {
                this.matrixElements = listToMatrix(elements, numberIssuesOnRow);
              } else { this.elements = elements; }
            });
          });
        } else {
          this.matrixElements = [];
        }
      });
    });
  }

  ngOnInit() {
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    if (this.baseRef.nativeElement.offsetWidth === this.baseRef.nativeElement.children[0].offsetWidth) {
      this.handle = true;
    } else { this.handle = false; }
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
      } else if (result === 'instruction') {
        this.dialog.open(InstructionDialog, { width: '360px' }).afterClosed().subscribe(result2 => {
          this.add(index);
        });
      }
    });
  }

  trash(element: MarvelElement, index: number) {
    this.generatorService.trash(element.id, index, 'zeszyty', this.series);
  }

  edit(element: MarvelElement, index: number) {
    const dialogRef = this.dialog.open(EditElementDialog, { data: Object.assign({}, element) });
    dialogRef.afterClosed().subscribe(newElement => {
      this.generatorService.tryReplaceElement(newElement, index, element, 'zeszyty', this.series);
    });
  }

  grab() { }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex,
        event.currentIndex - (this.currentIndex > this.previousIndex ? 1 : 0));
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex - (this.currentIndex > this.previousIndex ? 1 : 0));
    }
    this.seriesService.update(this.selectedSeries, 'zeszyty', [].concat(...this.matrixElements).map(e => e.id));
    this.previousIndex = this.currentIndex = 0;
  }

  singleDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
    this.seriesService.update(this.selectedSeries, 'zeszyty', this.elements.map(e => e.id));
  }

  exit(event: CdkDragExit<string[]>, index: number) {
    this.previousIndex = index;
  }

  enter(event: CdkDragEnter<string[]>, index: number) {
    if (this.previousIndex > (this.currentIndex = index)) {
      transferArrayItem(this.matrixElements[index],
        this.matrixElements[this.previousIndex],
        this.numberIssuesOnRow + 1,
        0);
    } else {
      transferArrayItem(this.matrixElements[index],
        this.matrixElements[this.previousIndex],
        0,
        this.numberIssuesOnRow + 1);
    }

  }

}
