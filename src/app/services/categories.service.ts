import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Categories, Category } from '../models/categories';

@Injectable()
export class CategoriesService {

  object: Categories;
  array: Array<Category>;

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      this.object = data;
      this.array = Object.keys(data).map(id => data[id]);
    });
  }

  private getJSON(): Observable<any> {
    return this.http.get('assets/data/Comics/categories.JSON');
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
    const array = Object.keys(this.object).map(id => this.object[id]);
    if (series) {
      this.checkAll(wave.series, series.checked, wave);
      this.checkAll(array.slice(1), wave.checked, array[0]);
    } else if (wave.title === Object.keys(this.object)[0]) {
      this.changeAll(
        array.slice(1).concat(
          array.slice(1).reduce((arr, category) => arr.concat(category.series), [])),
        wave.checked
      );
    } else {
      this.changeAll(wave.series, wave.checked);
      this.checkAll(array.slice(1), wave.checked, array[0]);
    }
  }

}
