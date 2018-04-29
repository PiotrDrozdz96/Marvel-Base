import { Component, OnInit } from '@angular/core';
import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';

import { MarvelElement } from '../../models/elements';

@Component({
  selector: 'app-generator-view',
  templateUrl: './generator-view.component.html',
  styleUrls: ['./generator-view.component.css']
})
export class GeneratorViewComponent implements OnInit {

  selectedSeries: string;
  elements: Array<MarvelElement>;

  constructor(
    private generatorService: GeneratorService,
    private seriesService: SeriesService,
    private baseService: BaseService
  ) {
    seriesService.get().subscribe(series => {
      generatorService.getSelectedSeries().subscribe(selectedSeries => {
        if (series[selectedSeries]) {
          baseService.get(series[selectedSeries].zeszyty).subscribe(elements => {
            this.elements = elements;
          });
        }
      });
    });
  }

  ngOnInit() {
  }

}
