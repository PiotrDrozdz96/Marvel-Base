import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LoadBaseDialog } from '../dialogs/load-base/load-base.dialog';

import { BaseService } from '../services/base.service';
import { CategoriesService } from '../services/categories.service';
import { ChronologyService } from '../services/chronology.service';
import { GeneratorService } from '../services/generator.service';
import { SeriesService } from '../services/series.service';
import { AddWaveDialog } from '../dialogs/add-wave/add-wave.dialog';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [GeneratorService, BaseService, CategoriesService, ChronologyService, SeriesService],
  encapsulation: ViewEncapsulation.None
})
export class GeneratorComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private baseService: BaseService,
    private categoriesService: CategoriesService,
    private chronologyService: ChronologyService,
    private generatorService: GeneratorService,
    private seriesService: SeriesService
  ) {
    this.route.paramMap.subscribe(params => {
      if (params.get('base') === 'User') {
        this.loadBase();
      } else if (params.get('base') === 'New') {
        this.baseService.set({});
        this.chronologyService.set([]);
        this.seriesService.set({});
        this.categoriesService.set({
          baseTitle: { title: 'Nowa Baza', checked: false }
        });
        this.addWave('Nurt', 'Seria');
      }
    });
  }

  addWave(wave: string, series: string) {this.generatorService.addWave(wave, series); }

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
      } else {
        this.router.navigate(['/Generator/Marvel_Now']);
      }

    });
  }

  ngOnInit() {
  }

}
