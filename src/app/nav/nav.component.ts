import { Component, OnInit, Renderer2 } from '@angular/core';

import { NavbarItem } from '../models/navbarItem';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  onNavbarItem: any;
  list: Array<NavbarItem>;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.list = [
      {title: 'Strona Główna', icon: 'fa fa-home'},
      {title: 'Video', icon: 'fa fa-television', dropdown: [
        {title: 'MCU', icon: 'fa fa-angle-right'},
        {title: 'Fox', icon: 'fa fa-angle-right'}
      ]},
      {title: 'Komiksy', icon: 'fa fa-book', dropdown: [
        {title: 'Marvel Now', icon: 'fa fa-angle-right'},
        {title: 'Moje Komiksy', icon: 'fa fa-angle-right'}
      ]},
      {title: 'Generator Kolekcji', icon: 'fa fa-building', dropdown: [
        {title: 'Marvel Now', icon: 'fa fa-angle-right'},
        {title: 'Nowa Kolekcja', icon: 'fa fa-angle-right'},
        {title: 'Moje Komiksy', icon: 'fa fa-angle-right'}
      ]}
    ];
  }

  dropdown(event: any) {
    const li = event.path[1];

    if (this.onNavbarItem) {
      this.renderer.removeClass(this.onNavbarItem, 'on');
    }

    if (li !== this.onNavbarItem) {
      this.renderer.addClass(li, 'on');
      this.onNavbarItem = li;
    } else { this.onNavbarItem = undefined; }

  }

}
