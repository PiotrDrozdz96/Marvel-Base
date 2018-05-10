import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';

import { Categories, Category } from '../models/categories';

@Injectable()
export class CategoriesService {

  private categories: Categories = {};
  private categoriesObs = new BehaviorSubject<Categories>(this.categories);

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      if (params.get('base') !== 'User') {
        this.getJSON(params.get('base')).subscribe(data => {
          this.categories = data;
          this.categoriesObs.next(data);
        });
      }
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/categories.JSON');
  }

  private changeAll(array: Array<Category>, checked: boolean) {
    array.forEach(function (element) { element.checked = checked; });
  }

  private checkAll(array: Array<Category>, checked: boolean, primary: Category) {
    if (checked && array.every((obj) => obj.checked)) {
      primary.checked = true;
    } else {
      primary.checked = false;
    }
  }

  change(wave: Category, series?: Category) {
    const array = Object.values(this.categories);
    if (series) {
      this.checkAll(wave.series, series.checked, wave);
      this.checkAll(array.slice(1), wave.checked, array[0]);
    } else if (wave.title === this.categories.baseTitle.title) {
      this.changeAll(
        array.slice(1).concat(
          array.slice(1).reduce((arr, category) => arr.concat(category.series), [])),
        wave.checked
      );
    } else {
      this.changeAll(wave.series, wave.checked);
      this.checkAll(array.slice(1), wave.checked, array[0]);
    }
    this.categoriesObs.next(this.categories);
  }

  get(): Observable<Categories> { return this.categoriesObs.asObservable(); }

  set(data) {
    this.categories = data;
    this.categoriesObs.next(data);
  }

  changeBaseTitle(title: string) {
    this.categories.baseTitle.title = title;
    this.categoriesObs.next(this.categories);
  }

  download() {
    const blob = new Blob([JSON.stringify(this.categories)], { type: 'text/csv' });
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'categories.JSON';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
