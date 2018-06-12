import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { MarvelElements, MarvelElement } from '../models/elements';
import { Categories } from '../models/categories';


@Injectable()
export class BaseService {

  private elements: MarvelElements = {};
  private elementsObs = new BehaviorSubject<MarvelElements>(this.elements);

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const baseLink = params.get('base');
      if (baseLink !== 'User' && baseLink !== 'New') {
        this.getJSON(baseLink).subscribe(data => {
          this.elements = data;
          this.elementsObs.next(data);
        });
      }
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/base.JSON');
  }

  get(ids: Array<string>, categories?: Categories): Observable<Array<MarvelElement>> {
    const defaultArr = [];
    const returnedObs = new BehaviorSubject(defaultArr);

    if (categories !== undefined) {
      const series = Object.values(categories).slice(1)
        .reduce((arr, category) => arr.concat(category.series), []);

      this.elementsObs.asObservable().subscribe(elements => {
        returnedObs.next(ids.filter(id => elements[id] === undefined ? false :
          elements[id].series.some(category => {
            const finded = series.find(obj => obj.title === category);
            return finded !== undefined ? finded.checked : false;
          })
        ).map(id => elements[id]));
      });
      return returnedObs.asObservable();
    } else {
      this.elementsObs.asObservable().subscribe(elements => {
        returnedObs.next(ids.map(id => elements[id] || {
          title: 'title',
          subTitle: 'subTtitle',
          publishedDate: 'publishedDate',
          id: id,
          volume: '',
          number: '',
          cover: '',
          series: []
        }));
      });
      return returnedObs.asObservable();
    }

  }

  getChilds(parentId: string) {
    const defaultArr = [];
    const returnedObs = new BehaviorSubject(defaultArr);

    this.elementsObs.asObservable().subscribe(elements => {
      if (elements[parentId]) {
        returnedObs.next([elements[parentId], ...(elements[parentId].children || []).map(id => elements[id])]);
      }
    });
    return returnedObs.asObservable();
  }

  set(data) {
    this.elements = data;
    this.elementsObs.next(data);
  }

  trash(id: string) {
    delete this.elements[id];
    this.elementsObs.next(this.elements);
  }

  update(id: string, element: MarvelElement) {
    if (id === element.id) {
      this.elements[id] = element;
      this.elementsObs.next(this.elements);
    } else {
      if (this.elements[element.id]) {
        return this.elements[element.id];
      } else {
        this.elements[element.id] = element;
        this.trash(id);
      }
    }
  }

  add(element: MarvelElement) {
    if (this.elements[element.id]) {
      return this.elements[element.id];
    } else {
      this.elements[element.id] = element;
    }
  }

  download() {
    const sortedBase = {};
    Object.keys(this.elements).sort().forEach(key => {
      sortedBase[key] = this.elements[key];
    });
    const blob = new Blob([JSON.stringify(sortedBase)], { type: 'text/csv' });
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'base.JSON';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
