import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/base.service';
import { CategoriesService } from '../services/categories.service';
import { ChronologyService } from '../services/chronology.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  providers: [BaseService, CategoriesService, ChronologyService]
})
export class BaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
