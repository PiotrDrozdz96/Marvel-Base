import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class ChronologyService {

  private chronology: Array<string> = [];
  private chronologyObs = new BehaviorSubject<Array<string>>(this.chronology);

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      if (params.get('base') !== 'User') {
        this.getJSON(params.get('base')).subscribe(data => {
          this.chronology = data;
          this.chronologyObs.next(data);
        });
      }
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/chronology.JSON');
  }

  get(): Observable<Array<string>> { return this.chronologyObs.asObservable(); }

  set(link: string) {
    this.getJSON(link).subscribe(data => {
      this.chronology = data;
      this.chronologyObs.next(data);
    });
  }

}
