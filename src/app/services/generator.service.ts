import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SeriesService } from './series.service';
import { BaseService } from './base.service';
import { MarvelElement } from '../models/elements';
import { MatDialog } from '@angular/material';
import { ConflictElementsDialog } from '../dialogs/conflict-elements/conflict-elements.dialog';

@Injectable()
export class GeneratorService {

  private selectedSeries = '';
  private selectedSeriesObS = new BehaviorSubject<string>(this.selectedSeries);


  constructor(
    private seriesService: SeriesService,
    private baseService: BaseService,
    private dialog: MatDialog
  ) { }

  changeSeries(series: string) {
    this.selectedSeries = series;
    this.selectedSeriesObS.next(series);
  }

  getSelectedSeries(): Observable<string> { return this.selectedSeriesObS.asObservable(); }

  trash(id: string, index: number, type: string, arr: Array<string>) {
    arr.splice(index, 1);
    this.seriesService.update(this.selectedSeries, type, arr);
    this.baseService.trash(id);
  }

  move(index: number, type: string, arr: Array<string>, way: number) {
    if ((way < 0 && index) || (way > 0 && index < arr.length)) {
      const removedElement = arr.splice(index, 1);
      arr.splice(index + way, 0, ...removedElement);
      this.seriesService.update(this.selectedSeries, type, arr);
    }
  }

  tryReplaceElement(
    newElement: MarvelElement,
    index: number,
    element: MarvelElement,
    type: string,
    arr: Array<string>
  ) {
    if (newElement) {
      const conflictElement = this.baseService.update(element.id, newElement);
      if (conflictElement === undefined) {
        arr[index] = newElement.id;
        this.seriesService.update(this.selectedSeries, type, arr);
      } else {
        const dialogRef = this.dialog.open(ConflictElementsDialog, {
          data: {
            element: conflictElement,
            newElement: newElement
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.tryReplaceElement(result, index, element, type, arr);
        });
      }
    }
  }
}
