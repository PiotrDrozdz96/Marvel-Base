import { Component, OnInit, Input } from '@angular/core';

 import { MarvelElement } from '../models/base';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {

  @Input()
  element: MarvelElement;

  constructor() { }

  ngOnInit() {
  }

}
