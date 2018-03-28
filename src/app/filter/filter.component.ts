import { Component, OnInit, Renderer2 } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { DropdownService } from '../services/dropdown.service';

import { Category } from '../models/category';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

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

  main(wave: Category, first: boolean) {
    wave.checked = !wave.checked;
    if (!first) {
      this.categories.changeAll(wave.series, wave.checked);
      this.categories.checkAll(
        this.categories.data.slice(1),
        wave.checked,
        this.categories.data[0]
      );
    } else {
      this.categories.changeAll(
        this.categories.data.slice(1).concat(
          this.categories.data.slice(1).reduce((array, category) =>
            array.concat(category.series), [])),
        wave.checked
      );
    }
  }

  secondary(wave: Category, series: Category) {
    series.checked = !series.checked;
    this.categories.checkAll(
      wave.series,
      series.checked,
      wave
    );
    this.categories.checkAll(
      this.categories.data.slice(1),
      wave.checked,
      this.categories.data[0]
    );
  }

}
