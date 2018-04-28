import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/base.service';
import { CategoriesService } from '../services/categories.service';
import { ChronologyService } from '../services/chronology.service';
import { GeneratorService } from '../services/generator.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css'],
  providers: [GeneratorService, BaseService, CategoriesService, ChronologyService]
})
export class GeneratorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
