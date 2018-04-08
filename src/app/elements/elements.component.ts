import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ElementComponent } from '../element/element.component';
import { CategoriesService } from '../services/categories.service';

import { Base, MarvelElement } from '../models/base';
import { Categories, Category } from '../models/categories';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent implements OnInit {

  base: Base;
  chronology: Array<string>;
  data: Array<MarvelElement>;

  constructor(private http: HttpClient, private categoriesService: CategoriesService) {

    this.getJSON('assets/data/Comics/base.JSON').subscribe(base => {
      this.base = base;

      this.getJSON('assets/data/Comics/chronology.JSON').subscribe(chronology => {
        this.chronology = chronology;

        this.categoriesService.get().subscribe((categories: Categories) => {
          const series = Object.keys(categories).map(id =>
            categories[id]).slice(1).reduce((arr, category) =>
              arr.concat(category.series), []);
          this.data = this.chronology.filter(id =>
            this.base[id].series.some(category =>
              series.find(obj => obj.title === category).checked)).map(id => this.base[id]);
        });
      });
    });
  }

  private getJSON(link): Observable<any> {
    return this.http.get(link);
  }

  ngOnInit() {
  }

}
