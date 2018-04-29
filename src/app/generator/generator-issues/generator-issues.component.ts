import { Component, OnInit } from '@angular/core';
import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';

import { MarvelElement } from '../../models/elements';

@Component({
  selector: 'app-generator-issues',
  templateUrl: './generator-issues.component.html',
  styleUrls: ['./generator-issues.component.css']
})
export class GeneratorIssuesComponent implements OnInit {

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

  add() {
    console.log('add');
  }

  trash() {
    console.log('trash');
  }

  turnLeft() {
    console.log('turnLeft');
  }

  turnRight() {
    console.log('turnRight');
  }

  edit() {
    console.log('edit');
  }

}
