import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/base.service';
import { CategoriesService } from '../services/categories.service';
import { ChronologyService } from '../services/chronology.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadBaseDialog } from '../dialogs/load-base/load-base.dialog';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  providers: [BaseService, CategoriesService, ChronologyService]
})
export class BaseComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private baseService: BaseService,
    private categoriesService: CategoriesService,
    private chronologyService: ChronologyService
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
      if (result && result['base.JSON'] && result['categories.JSON'] && result['chronology.JSON']) {
        this.baseService.set(result['base.JSON']);
        this.categoriesService.set(result['categories.JSON']);
        this.chronologyService.set(result['chronology.JSON']);
      } else if (result !== undefined) {
        this.loadBase();
      }

    });
  }

  ngOnInit() {
  }

}
