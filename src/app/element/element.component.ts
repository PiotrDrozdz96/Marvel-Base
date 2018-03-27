import { Component, OnInit, Input } from '@angular/core';

import { Element } from '../models/base';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {

  @Input()
  element: Element;

  constructor() { }

  ngOnInit() {
  }

}
