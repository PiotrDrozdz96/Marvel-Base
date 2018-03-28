import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Category } from '../models/category';

@Injectable()
export class CategoriesService {

  data: Array<Category>;

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      this.data = data;
    });
  }

  private getJSON(): Observable<any> {
    return this.http.get('assets/data/Comics/categories.JSON');
  }

  changeAll(array:  Array<Category>, checked: boolean) {
    array.forEach(function (element) { element.checked = checked; });
  }

  checkAll(array: Array<Category>, checked: boolean, primary: Category) {
    if (checked && array.every((obj) => obj.checked)) {
      primary.checked = true;
    } else {
      primary.checked = false;
    }
  }

}
