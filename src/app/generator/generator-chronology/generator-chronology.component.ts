import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { ChronologyService } from '../../services/chronology.service';
import { MarvelElement } from '../../models/elements';
import { SeriesService } from '../../services/series.service';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-generator-chronology',
  templateUrl: './generator-chronology.component.html'
})
export class GeneratorChronologyComponent implements OnInit {

  chronologyElements: Array<MarvelElement>;
  elements: Array<MarvelElement>;
  chronology: Array<string>;

  constructor(
    private baseService: BaseService,
    private chronologyService: ChronologyService,
    private seriesService: SeriesService,
    private generatorService: GeneratorService
  ) {
    chronologyService.get().subscribe(chronology => {
      this.chronology = chronology;
      baseService.get(chronology).subscribe(elements => {
        this.chronologyElements = elements;
      });
    });
    seriesService.get().subscribe(series => {
      generatorService.getSelectedSeries().subscribe(selectedSeries => {
        generatorService.getSelectedType().subscribe(selectedType => {
          if (series[selectedSeries] && series[selectedSeries][selectedType]) {
            baseService.get(series[selectedSeries][selectedType]).subscribe(elements => {
              this.elements = elements;
            });
          }
        });
      });
    });
  }

  ngOnInit() {
  }

  addChild(element: MarvelElement) {
    if (this.chronology.find(e => e === element.id)) {
      alert('Element znajduje się już na liście');
    } else {
      this.chronology.push(element.id);
      this.chronologyService.set(this.chronology);
    }
  }

  moveChild(index: number, way: number) {
    if (!way || (way < 0 && index) || (way > 0 && index < this.chronology.length)) {
      const removedElement = this.chronology.splice(index, 1);
      if (way) {
        this.chronology.splice(index + way, 0, ...removedElement);
      }
      this.chronologyService.set(this.chronology);
    }
  }

}
