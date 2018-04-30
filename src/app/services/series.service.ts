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
      if (params.get('base') !== 'User') {
        this.getJSON(params.get('base')).subscribe(data => {
          this.series = data;
          this.seriesObs.next(data);
        });
      }
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/series.JSON');
  }

  get(): Observable<Series> { return this.seriesObs.asObservable(); }

  set(data) {
    this.series = data;
    this.seriesObs.next(data);
  }

  update(seriesName: string, type: string, series: Array<string>) {
    this.series[seriesName][type] = series;
    this.seriesObs.next(this.series);
  }

}
