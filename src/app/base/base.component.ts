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

        const dialogRef = this.dialog.open(LoadBaseDialog, { width: '360px'} );
        dialogRef.afterClosed().subscribe(result => {
          baseService.set(result['base.JSON']);
          categoriesService.set(result['categories.JSON']);
          chronologyService.set(result['chronology.JSON']);
        });

      }
    });
  }

  ngOnInit() {
  }

}
