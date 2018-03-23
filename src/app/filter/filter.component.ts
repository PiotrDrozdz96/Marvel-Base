import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  providers: [CategoriesService]
})
export class FilterComponent implements OnInit {

  constructor(private categories: CategoriesService) { }

  ngOnInit() {

  }

}
