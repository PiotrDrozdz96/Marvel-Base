import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/base.service';
import { CategoriesService } from '../services/categories.service';
import { ChronologyService } from '../services/chronology.service';
import { GeneratorService } from '../services/generator.service';
import { SeriesService } from '../services/series.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [GeneratorService, BaseService, CategoriesService, ChronologyService, SeriesService]
})
export class GeneratorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
