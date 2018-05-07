import { Component, OnInit } from '@angular/core';
import { ToolbarItem } from '../../models/toolbarItem';
import { CategoriesService } from '../../services/categories.service';
import { Category, Categories } from '../../models/categories';
import { GeneratorService } from '../../services/generator.service';
import { SeriesService } from '../../services/series.service';
import { BaseService } from '../../services/base.service';
import { ChronologyService } from '../../services/chronology.service';

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
  selectedType = 'tomy';
  title: string;
  newSeries = '';
  newWave = '';

  constructor(
    private generatorService: GeneratorService,
    private categoriesService: CategoriesService,
    private seriesService: SeriesService,
    private chronologyService: ChronologyService,
    private baseService: BaseService
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

  deleteSeries(seriesTitle: string) {
    let series;
    this.seriesService.get().subscribe(result => {
      series = result;
    }).unsubscribe();
    series[seriesTitle].zeszyty.forEach(id => this.baseService.trash(id));
    series[seriesTitle].tomy.forEach(id => this.baseService.trash(id));
    delete series[seriesTitle];
    this.seriesService.set(series);
    this.categories[this.selectedWave].series.splice(
      this.categories[this.selectedWave].series.findIndex(obj => obj.title === seriesTitle)
      , 1
    );
    this.categoriesService.set(this.categories);
  }

  deleteWave(waveTitle: string) {
    this.categories[waveTitle].series.map(obj => obj.title)
      .forEach(seriesTitle => this.deleteSeries(seriesTitle));
    delete this.categories[waveTitle];
    this.categoriesService.set(this.categories);
  }

  addSeries(waveTitle: string, newSeries: string) {
    if (newSeries !== '') {
      let series;
      this.seriesService.get().subscribe(result => {
        series = result;
      }).unsubscribe();
      if (series[newSeries]) {
        alert('Istnieje taka seria');
      } else {
        series[newSeries] = { zeszyty: [], tomy: [] };
        this.seriesService.set(series);
        this.categories[waveTitle].series.push({ title: newSeries, checked: false });
        this.categories[waveTitle].series.sort((a, b) => a.title > b.title ? 1 : -1);
        this.categoriesService.set(this.categories);
        this.newSeries = '';
      }
    }
  }

  addWave(newWave: string) {
    if (newWave !== '') {
      if (this.categories[newWave]) {
        alert('Istnieje taki nurt');
      } else {
        this.categories[newWave] = { title: newWave, checked: false, series: [] };
        const newCategories = {};
        newCategories[this.title] = this.categories[this.title];
        Object.keys(this.categories).slice(1).sort()
          .forEach(key => newCategories[key] = this.categories[key]);
        this.categoriesService.set(newCategories);
        this.newWave = '';
      }
    }
  }

  download() {
    this.chronologyService.download();
    this.seriesService.download();
    this.categoriesService.download();
    this.baseService.download();
  }

}
