import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SeriesService } from './series.service';
import { BaseService } from './base.service';
import { MarvelElement } from '../models/elements';
import { MatDialog } from '@angular/material';
import { ConflictElementsDialog } from '../dialogs/conflict-elements/conflict-elements.dialog';
import { ConflictGrabElementsDialog } from '../dialogs/conflict-grab-elements/conflict-grab-elements.dialog';
import { AddWaveDialog } from '../dialogs/add-wave/add-wave.dialog';
import { CategoriesService } from './categories.service';
import { Router } from '@angular/router';

@Injectable()
export class GeneratorService {

  private selectedSeries: string;
  private selectedType = 'tomy';
  private selectedTypeObS = new BehaviorSubject<string>(this.selectedType);


  constructor(
    private router: Router,
    private seriesService: SeriesService,
    private baseService: BaseService,
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {
    this.categoriesService.getSelectedSeries().subscribe(selectedSeries =>
      this.selectedSeries = selectedSeries);
  }

  changeType(type: string) {
    this.selectedType = type;
    this.selectedTypeObS.next(type);
  }

  getSelectedType(): Observable<string> { return this.selectedTypeObS.asObservable(); }

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

  tryAddElement(newElement: MarvelElement, index: number, type: string, arr: Array<string>) {
    if (newElement) {
      const conflictElement = this.baseService.add(newElement);
      if (conflictElement === undefined) {
        arr.splice(index, 0, newElement.id);
        this.seriesService.update(this.selectedSeries, type, arr);
      } else {
        const dialogRef = this.dialog.open(ConflictElementsDialog, {
          data: {
            element: conflictElement,
            newElement: newElement
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.tryAddElement(result, index, type, arr);
        });
      }
    }
  }

  tryAddElements(newElements: Array<MarvelElement>, index: number, arr: Array<string>) {
    let newElement = newElements.shift();
    let conflictElement = this.baseService.add(newElement);
    while (newElement !== undefined && conflictElement === undefined) {
      arr.splice(index, 0, newElement.id);
      this.seriesService.update(this.selectedSeries, 'zeszyty', arr);
      index++;
      newElement = newElements.shift();
      if (newElement !== undefined) { conflictElement = this.baseService.add(newElement); }
    }
    if (newElement !== undefined && conflictElement !== undefined) {
      const dialogRef = this.dialog.open(ConflictGrabElementsDialog, {
        data: {
          element: conflictElement,
          newElement: newElement
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.tryAddElements([result, ...newElements], index, arr);
        } else if (result === false) {
          this.tryAddElements(newElements, index, arr);
        }
      });
    }
  }

  addWave(wave: string, series: string) {
    const dialogRef = this.dialog.open(AddWaveDialog, { width: '360px', data: [wave, series] });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.wave !== '' && result.series !== '') {
        if (this.categoriesService.exist(result.wave) || this.seriesService.exist(result.series)) {
          this.addWave(
            result.wave + (this.categoriesService.exist(result.wave) ? ' <- Istnieje taki nurt' : ''),
            result.series + (this.seriesService.exist(result.series) ? ' <- Istnieje taka seria' : '')
          );
        } else {
          this.seriesService.add(result.series);
          this.categoriesService.add(result.wave, result.series);
          this.categoriesService.changeWave(result.wave);
          this.categoriesService.changeSeries(result.series);
        }
      }
    });
  }

}
