import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ChronologyService {

  private chronology: Array<string> = [];
  private chronologyObs = new BehaviorSubject<Array<string>>(this.chronology);

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      this.chronology = data;
      this.chronologyObs.next(data);
    });
  }

  private getJSON(): Observable<any> {
    return this.http.get('assets/data/Comics/chronology.JSON');
  }

  get(): Observable<Array<string>> { return this.chronologyObs.asObservable(); }
}
