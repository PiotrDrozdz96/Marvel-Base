import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeneratorService {

  private selectedSeries = '';
  private selectedSeriesObS = new BehaviorSubject<string>(this.selectedSeries);

  constructor() { }

  changeSeries(series: string) {
    this.selectedSeries = series;
    this.selectedSeriesObS.next(series);
  }

  getSelectedSeries(): Observable<string> { return this.selectedSeriesObS.asObservable(); }
}
