import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChronologyService {

  private chronology: Array<string> = [];
  private chronologyObs = new BehaviorSubject<Array<string>>(this.chronology);

  constructor(private http: HttpClient) { }

  set(baseLink: string) {
    this.getJSON(baseLink).subscribe(data => {
      this.chronology = data;
      this.chronologyObs.next(data);
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/chronology.JSON');
  }

  get(): Observable<Array<string>> { return this.chronologyObs.asObservable(); }
}
