import { Component, OnInit, Renderer2 } from '@angular/core';

import { CategoriesService } from '../services/categories.service';
import { DropdownService } from '../services/dropdown.service';

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
    private dropdownService: DropdownService
  ) {
    this.categoriesService.get().subscribe(categories => {
      this.categories = Object.values(categories);
    });
  }

  ngOnInit() {
  }

  dropdown(event: any) {
    this.onCategory = this.dropdownService.dropdown(this.renderer, this.onCategory, event.path[1]);
  }

}
