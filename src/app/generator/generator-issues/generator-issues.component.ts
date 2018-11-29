import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';

import { listToMatrix } from '../../functions/listToMatrix';

import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { CategoriesService } from '../../services/categories.service';
import { BaseService } from '../../services/base.service';
import { WindowService } from '../../services/window.service';

import { GeneratorElements } from '../generator-elements';

@Component({
  selector: 'app-generator-issues',
  templateUrl: './generator-issues.component.html'
})
export class GeneratorIssuesComponent extends GeneratorElements {

  type = 'zeszyty';

  constructor(
    public renderer: Renderer2,
    public generatorService: GeneratorService,
    public seriesService: SeriesService,
    public categoriesService: CategoriesService,
    public baseService: BaseService,
    public windowService: WindowService,
    public dialog: MatDialog
  ) {
    super(renderer, generatorService, seriesService, categoriesService, baseService, windowService, dialog);
    seriesService.get().subscribe(series => {
      categoriesService.getSelectedSeries().subscribe(selectedSeries => {
        if (series[selectedSeries]) {
          this.series = series[selectedSeries].zeszyty;
          this.selectedSeries = selectedSeries;
          baseService.get(series[selectedSeries].zeszyty).subscribe(elements => {
            windowService.getCountElements().subscribe(numberIssuesOnRow => {
              this.numberIssuesOnRow = numberIssuesOnRow;
              if (numberIssuesOnRow > 2) {
                this.matrixElements = listToMatrix(elements, numberIssuesOnRow);
              } else { this.matrixElements = [elements]; }
            });
          });
        } else {
          this.matrixElements = [];
        }
      });
    });
  }
}
