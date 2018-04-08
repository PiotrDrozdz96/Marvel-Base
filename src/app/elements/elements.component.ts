import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ElementComponent } from '../element/element.component';
import { BaseService } from '../services/base.service';

import { MarvelElement } from '../models/elements';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent implements OnInit {

  data: Array<MarvelElement>;

  constructor(baseService: BaseService) {
    baseService.get().subscribe(data => {this.data = data; });
  }

  ngOnInit() {
  }

}
