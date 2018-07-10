import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ElementComponent } from '../element/element.component';

import { MarvelElement } from '../models/elements';

import { BaseService } from '../services/base.service';
import { ChronologyService } from '../services/chronology.service';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent implements OnInit {

  data: Array<MarvelElement>;

  constructor(
    baseService: BaseService,
    chronologyService: ChronologyService,
    categoriesService: CategoriesService
  ) {
    categoriesService.get().subscribe(categories => {
      chronologyService.get().subscribe(chronology => {
        baseService.get(chronology, categories).subscribe(data => {
          this.data = data;
        });
      });
    });
  }

  ngOnInit() {
  }

}
