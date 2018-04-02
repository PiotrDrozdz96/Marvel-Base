import { Component, OnInit, Renderer2 } from '@angular/core';

import { CategoriesService } from '../services/categories.service';
import { DropdownService } from '../services/dropdown.service';

import { Category } from '../models/categories';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  onCategory: any;

  constructor(
    private categories: CategoriesService,
    private renderer: Renderer2,
    private dropdownService: DropdownService
  ) { }

  ngOnInit() {
  }

  dropdown(event: any) {
    this.onCategory = this.dropdownService.dropdown(this.renderer, this.onCategory, event.path[1]);
  }

}
