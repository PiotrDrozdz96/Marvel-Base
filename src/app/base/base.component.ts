import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Base } from '../models/base';
import { ElementComponent} from '../element/element.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  base: Base;
  chronology: Array<string>;

  constructor(private http: HttpClient) {
    this.getJSON('assets/data/Comics/base.JSON').subscribe(data => {
      this.base = data;
    });
    this.getJSON('assets/data/Comics/chronology.JSON').subscribe(data => {
      this.chronology = data;
    });
   }

  private getJSON(link): Observable<any> {
    return this.http.get(link);
  }

  ngOnInit() {
  }

}
