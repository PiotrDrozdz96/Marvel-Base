import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Categories, Category } from '../models/categories';

@Injectable()
export class CategoriesService {

  private categories: Categories = {
    baseTitle: { title: 'Nowa Baza', checked: false }
  };
  private categoriesObs = new BehaviorSubject<Categories>(this.categories);

  private selectedWave = '';
  private selectedWaveObs = new BehaviorSubject<string>(this.selectedWave);

  private selectedSeries = '';
  private selectedSeriesObs = new BehaviorSubject<string>(this.selectedSeries);

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const baseLink = params.get('base');
      if (baseLink !== 'User' && baseLink !== 'New') {
        this.getJSON(baseLink).subscribe(data => {
          this.categories = data;
          this.categoriesObs.next(data);

          const waves = Object.values(data).slice(1);
          if (waves[0]) {
            this.selectedWave = waves[0]['title'];
            this.selectedWaveObs.next(this.selectedWave);
            this.selectedSeries = waves[0]['series'][0].title;
            this.selectedSeriesObs.next(this.selectedSeries);
          }

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

  exist(wave: string) {
    return this.categories[wave] ? true : false;
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
  getSelectedWave(): Observable<string> { return this.selectedWaveObs.asObservable(); }
  getSelectedSeries(): Observable<string> { return this.selectedSeriesObs.asObservable(); }

  set(data) {
    this.categories = data;
    this.categoriesObs.next(data);
  }
  changeWave(wave: string) {
    this.selectedWave = wave;
    this.selectedWaveObs.next(wave);
  }
  changeSeries(series: string) {
    this.selectedSeries = series;
    this.selectedSeriesObs.next(series);
  }

  add(newWave: string, newSeries?: string) {
    if (!this.categories[newWave]) {
      if (!newSeries) {
        this.categories[newWave] = { title: newWave, checked: false, series: [] };
      } else {
        this.categories[newWave] = {
          title: newWave, checked: false, series: [{
            title: newSeries, checked: false
          }]
        };
      }
      const newCategories = {};
      newCategories['baseTitle'] = this.categories.baseTitle;
      Object.keys(this.categories).slice(1).sort()
        .forEach(key => newCategories[key] = this.categories[key]);
      this.set(newCategories);
    } else {
      this.categories[newWave].series.push({
        title: newSeries, checked: false
      });
      this.categoriesObs.next(this.categories);
    }

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
