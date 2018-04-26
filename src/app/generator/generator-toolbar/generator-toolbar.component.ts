import { Component, OnInit } from '@angular/core';
import { ToolbarItem } from '../../models/toolbarItem';

@Component({
  selector: 'app-generator-toolbar',
  templateUrl: './generator-toolbar.component.html',
  styleUrls: ['./generator-toolbar.component.css']
})
export class GeneratorToolbarComponent implements OnInit {

  toolbar: Array<ToolbarItem>;

  constructor() { }

  ngOnInit() {
    this.toolbar = [{ id: 'view', value: 'Wyświetl'},
    { id: 'delete', value: 'Usuwanie'},
    { id: 'edit', value: 'Edycja /Dodawanie'},
    { id: 'volumes', value: 'Twórz Tomy'},
    { id: 'chronology', value: 'Twórz chronologie'}];
  }

}
