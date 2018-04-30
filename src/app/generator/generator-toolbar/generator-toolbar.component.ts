import { Component, OnInit } from '@angular/core';
import { ToolbarItem } from '../../models/toolbarItem';
import { CategoriesService } from '../../services/categories.service';
import { Category, Categories } from '../../models/categories';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-generator-toolbar',
  templateUrl: './generator-toolbar.component.html',
  styleUrls: ['./generator-toolbar.component.css']
})
export class GeneratorToolbarComponent implements OnInit {

  toolbar: Array<ToolbarItem>;
  categories: Categories;
  waves: Array<Category>;
  selectedWave: string;
  selectedSeries: string;
  title: string;
  page: string;

  constructor(
    private generatorService: GeneratorService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.toolbar = [{ id: 'issues', value: 'Zeszyty' },
    { id: 'volumes', value: 'Tomy' },
    { id: 'chronology', value: 'Chronologia' }];

    this.categoriesService.get().subscribe(categories => {
      this.categories = categories;
      this.title = Object.keys(categories)[0];
      this.waves = Object.values(categories).slice(1);
      if (this.waves[0]) {
        this.selectedWave = this.waves[0].title;
        this.selectedSeries = this.waves[0].series[0].title;
        this.generatorService.changeSeries(this.selectedSeries);
      }
    });
  }

  changeWave() {
    this.selectedSeries = this.categories[this.selectedWave].series[0].title;
    this.generatorService.changeSeries(this.selectedSeries);
  }

}
