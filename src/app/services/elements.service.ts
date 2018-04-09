import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MarvelElements } from '../models/elements';

@Injectable()
export class ElementsService {

  private elements: MarvelElements = {};
  private elementsObs = new BehaviorSubject<MarvelElements>(this.elements);

  constructor(private http: HttpClient) { }

  set(baseLink: string) {
    this.getJSON(baseLink).subscribe(data => {
      this.elements = data;
      this.elementsObs.next(data);
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/base.JSON');
  }

  get(): Observable<MarvelElements> { return this.elementsObs.asObservable(); }
}
