import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/base.service';
import { CategoriesService } from '../services/categories.service';
import { ChronologyService } from '../services/chronology.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  providers: [BaseService, CategoriesService, ChronologyService]
})
export class BaseComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private baseService: BaseService,
    private categoriesService: CategoriesService,
    private chronologyService: ChronologyService
  ) {
    this.route.paramMap.subscribe(params => {
      if (params.get('base') === 'User') {
        this.baseService.set('Marvel_Now');
        this.categoriesService.set('Marvel_Now');
        this.chronologyService.set('Marvel_Now');
      }
    });
  }

  ngOnInit() {
  }

}
