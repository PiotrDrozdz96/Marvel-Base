import { Component, OnInit, Renderer2 } from '@angular/core';

import { NavbarItem } from '../models/navbarItem';
import { DropdownService } from '../services/dropdown.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  onItem: any;
  list: Array<NavbarItem>;

  constructor(
    private renderer: Renderer2,
    private dropdownService: DropdownService
  ) { }

  ngOnInit() {
    this.list = [
      {title: 'Główna', icon: 'fa fa-home'},
      {title: 'Video', icon: 'fa fa-television', dropdown: [
        {title: 'MCU', icon: 'fa fa-angle-right'},
        {title: 'Fox', icon: 'fa fa-angle-right'}
      ]},
      {title: 'Komiksy', icon: 'fa fa-book', dropdown: [
        {title: 'Marvel Now', icon: 'fa fa-angle-right'},
        {title: 'Moje Komiksy', icon: 'fa fa-angle-right'}
      ]},
      {title: 'Generator', icon: 'fa fa-building', dropdown: [
        {title: 'Marvel Now', icon: 'fa fa-angle-right'},
        {title: 'Nowa Kolekcja', icon: 'fa fa-angle-right'},
        {title: 'Moje Komiksy', icon: 'fa fa-angle-right'}
      ]}
    ];
  }

  dropdown(event: any) {
    this.onItem = this.dropdownService.dropdown(
      this.renderer,
      this.onItem,
      event.path.find(e => e.className === 'navbar-item' || e.className === 'navbar-item on')
    );
 }

}
