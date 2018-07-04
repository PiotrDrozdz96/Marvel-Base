import { Component, OnInit } from '@angular/core';

import { CategoriesService } from '../../services/categories.service';

import { Categories, Category } from '../../models/categories';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-generator-categories',
  templateUrl: './generator-categories.component.html',
  styleUrls: ['./generator-categories.css']
})
export class GeneratorCategoriesComponent implements OnInit {

  categoriesArray: Array<Category>;
  categories: Categories;

  constructor(
    private categoriesService: CategoriesService,
    private seriesService: SeriesService,
    private baseService: BaseService,
    private generatorService: GeneratorService
  ) {
    this.categoriesService.get().subscribe(categories => {
      this.categoriesArray = Object.values(categories);
      this.categories = categories;
    });
  }

  ngOnInit() { }

  deleteSeries(waveTitle: string, seriesTitle: string) {
    if (this.categoriesArray.length > 2 || this.categories[waveTitle].series.length > 1) {
      let series;
      this.seriesService.get().subscribe(result => {
        series = result;
      }).unsubscribe();
      series[seriesTitle].zeszyty.forEach(id => this.baseService.trash(id));
      series[seriesTitle].tomy.forEach(id => this.baseService.trash(id));
      delete series[seriesTitle];
      this.seriesService.set(series);
      this.categories[waveTitle].series.splice(
        this.categories[waveTitle].series.findIndex(obj => obj.title === seriesTitle)
        , 1
      );
      if (this.categories[waveTitle].series.length === 0) {
        delete this.categories[waveTitle];
      }
      this.categoriesService.set(this.categories);
    } else {
      alert('Musi istnieć przynajmniej jeden nurt!');
    }
  }

  deleteWave(waveTitle: string) {
    if (this.categoriesArray.length > 2) {
      this.categories[waveTitle].series.map(obj => obj.title)
        .forEach(seriesTitle => this.deleteSeries(waveTitle, seriesTitle));
    } else {
      alert('Musi istnieć przynajmniej jeden nurt!');
    }
  }

}
