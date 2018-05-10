import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';

import { Series } from '../models/series';

@Injectable()
export class SeriesService {

  private series: Series = {};
  private seriesObs = new BehaviorSubject<Series>(this.series);

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const baseLink = params.get('base');
      if (baseLink !== 'User' && baseLink !== 'New') {
        this.getJSON(baseLink).subscribe(data => {
          this.series = data;
          this.seriesObs.next(data);
        });
      }
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/series.JSON');
  }

  exist(series: string) {
    return this.series[series] ? true : false;
  }

  get(): Observable<Series> { return this.seriesObs.asObservable(); }

  set(data) {
    this.series = data;
    this.seriesObs.next(data);
  }

  add(seriesName) {
    this.series[seriesName] = {zeszyty: [], tomy: []};
    this.seriesObs.next(this.series);
  }

  update(seriesName: string, type: string, series: Array<string>) {
    this.series[seriesName][type] = series;
    this.seriesObs.next(this.series);
  }

  download() {
    const sortedSeries = {};
    Object.keys(this.series).sort().forEach( key => {
      sortedSeries[key] = this.series[key];
    });
    const blob = new Blob([JSON.stringify(sortedSeries)], { type: 'text/csv' });
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'series.JSON';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
