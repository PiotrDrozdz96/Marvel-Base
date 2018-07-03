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
  baseTitle: string;
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
    { id: 'chronology', value: 'Chronologia' },
    { id: 'categories', value: 'Kategorie'}];

    this.categoriesService.get().subscribe(categories => {
      this.categories = categories;
      this.baseTitle = categories.baseTitle ? categories.baseTitle.title : 'baseTitle';
      this.waves = Object.values(categories).slice(1);
    });

    this.categoriesService.getSelectedWave().subscribe(selectedWave => {
      this.selectedWave = selectedWave;
    });

    this.categoriesService.getSelectedSeries().subscribe(selectedSeries => {
      this.selectedSeries = selectedSeries;
    });
  }

  download() {
    this.chronologyService.download();
    this.seriesService.download();
    this.categoriesService.download();
    this.baseService.download();
  }

}
