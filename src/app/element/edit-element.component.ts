import { Component, OnInit, Input } from '@angular/core';

 import { MarvelElement } from '../models/elements';

@Component({
  selector: 'app-edit-element',
  templateUrl: './edit-element.component.html',
  styleUrls: ['./element.component.css', './edit-element.component.css']
})
export class EditElementComponent implements OnInit {

  @Input()
  public element: MarvelElement;

  constructor() { }

  ngOnInit() {
  }

  changeCover() {
    this.element.cover = prompt('Cover link', this.element.cover);
  }

}
