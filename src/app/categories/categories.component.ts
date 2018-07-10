import { Component, OnInit, Renderer2 } from '@angular/core';

import { CategoriesService } from '../services/categories.service';

import { Categories, Category } from '../models/categories';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['../../toolbar.css']
})
export class CategoriesComponent implements OnInit {

  onCategory: any;
  categories: Array<Category>;

  constructor(
    private categoriesService: CategoriesService,
    private renderer: Renderer2,
  ) {
    this.categoriesService.get().subscribe(categories => {
      this.categories = Object.values(categories);
    });
  }

  ngOnInit() {
  }

  dropdown(event: any) {
    const el = event.path[1];
    if (this.onCategory) {
      this.renderer.removeClass(this.onCategory, 'on');
    }

    if (el !== this.onCategory) {
      this.renderer.addClass(el, 'on');
      this.onCategory = el;
    } else { this.onCategory = undefined; }
  }

}
