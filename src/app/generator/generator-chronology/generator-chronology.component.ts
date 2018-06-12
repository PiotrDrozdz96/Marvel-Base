import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { ChronologyService } from '../../services/chronology.service';
import { MarvelElement } from '../../models/elements';
import { SeriesService } from '../../services/series.service';
import { GeneratorService } from '../../services/generator.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-generator-chronology',
  templateUrl: './generator-chronology.component.html'
})
export class GeneratorChronologyComponent implements OnInit {

  chronologyElements: Array<MarvelElement>;
  elements: Array<MarvelElement>;
  chronology: Array<string>;
  markerIndex: number;

  constructor(
    private baseService: BaseService,
    private chronologyService: ChronologyService,
    private seriesService: SeriesService,
    private categoriesService: CategoriesService,
    private generatorService: GeneratorService
  ) {
    chronologyService.get().subscribe(chronology => {
      this.chronology = chronology;
      this.markerIndex = chronology.length;
      baseService.get(chronology).subscribe(elements => {
        this.chronologyElements = elements;
      });
    });
    seriesService.get().subscribe(series => {
      categoriesService.getSelectedSeries().subscribe(selectedSeries => {
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
      const index = this.markerIndex;
      this.chronology.splice(this.markerIndex, 0, element.id);
      this.chronologyService.set(this.chronology);
      this.markerIndex = index + 1;
    }
  }

  moveChild(index: number, way: number) {
    const prevIndex = this.markerIndex;
    if (!way || (way < 0 && index) || (way > 0 && index < this.chronology.length)) {
      const removedElement = this.chronology.splice(index, 1);
      if (way) {
        this.chronology.splice(index + way, 0, ...removedElement);
      }
      this.chronologyService.set(this.chronology);
      if (way || index >= prevIndex) {
        this.markerIndex = prevIndex;
      } else {
        this.markerIndex = prevIndex - 1;
      }
    }
  }

}
