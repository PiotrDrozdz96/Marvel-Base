import { Component, OnInit, Renderer2 } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { DropdownService } from '../services/dropdown.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  providers: [CategoriesService]
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

}
