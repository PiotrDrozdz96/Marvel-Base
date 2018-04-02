import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Base, MarvelElement } from '../models/base';
import { ElementComponent } from '../element/element.component';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  base: Base;
  chronology: Array<String>;
  data: Array<MarvelElement>;

  constructor(private http: HttpClient, private categories: CategoriesService) {

    this.getJSON('assets/data/Comics/base.JSON').subscribe(base => {
      this.base = base;

      this.getJSON('assets/data/Comics/chronology.JSON').subscribe(chronology => {
        this.chronology = chronology;
        this.data = chronology.map(id => this.base[id]);
      });
    });
  }

  private getJSON(link): Observable<any> {
    return this.http.get(link);
  }

  ngOnInit() {
  }

}
