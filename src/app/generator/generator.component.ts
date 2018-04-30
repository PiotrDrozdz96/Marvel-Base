import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadBaseDialog } from '../dialogs/load-base/load-base.dialog';

import { BaseService } from '../services/base.service';
import { CategoriesService } from '../services/categories.service';
import { ChronologyService } from '../services/chronology.service';
import { GeneratorService } from '../services/generator.service';
import { SeriesService } from '../services/series.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [GeneratorService, BaseService, CategoriesService, ChronologyService, SeriesService]
})
export class GeneratorComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private baseService: BaseService,
    private categoriesService: CategoriesService,
    private chronologyService: ChronologyService,
    private seriesService: SeriesService
  ) {
    this.route.paramMap.subscribe(params => {
      if (params.get('base') === 'User') {
        this.loadBase();
      }
    });
  }

  loadBase() {
    const dialogRef = this.dialog.open(LoadBaseDialog, { width: '360px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['base.JSON'] &&
      result['categories.JSON'] && result['chronology.JSON'] && result['series.JSON']) {
        this.baseService.set(result['base.JSON']);
        this.categoriesService.set(result['categories.JSON']);
        this.chronologyService.set(result['chronology.JSON']);
        this.seriesService.set(result['series.JSON']);
      } else if (result !== undefined) {
        this.loadBase();
      }

    });
  }

  ngOnInit() {
  }

}
