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
      { title: 'Główna', icon: 'fa fa-home', href: '' },
      {
        title: 'Video', icon: 'fa fa-television', dropdown: [
          { title: 'MCU', icon: 'fa fa-angle-right', href: '/Base/MCU'  },
          { title: 'Fox', icon: 'fa fa-angle-right', href: '/Base/Fox' }
        ]
      },
      {
        title: 'Komiksy', icon: 'fa fa-book', dropdown: [
          { title: 'Marvel Now', icon: 'fa fa-angle-right', href: '/Base/Marvel_Now' },
          { title: 'Moje Komiksy', icon: 'fa fa-angle-right', href: '/Base/User' }
        ]
      },
      {
        title: 'Generator', icon: 'fa fa-building', dropdown: [
          { title: 'Marvel Now', icon: 'fa fa-angle-right', href: '/Generator/Marvel_Now' },
          { title: 'Nowa Kolekcja', icon: 'fa fa-angle-right', href: '/Generator/New' },
          { title: 'Moje Komiksy', icon: 'fa fa-angle-right', href: '/Generator/User' }
        ]
      }
    ];
  }

  dropdown(event: any) {
    this.onItem = this.dropdownService.dropdown(
      this.renderer,
      this.onItem,
      event.path.find(e => e.className === 'navbar-item' || e.className === 'navbar-item on')
    );
  }

  toolbar() {
    const toolbar = document.getElementsByClassName('toolbar')[0];
    if (toolbar) {
      if (toolbar.getAttribute('hidden') === null) {
        this.renderer.setAttribute(toolbar, 'hidden', 'true');
      } else {
        this.renderer.removeAttribute(toolbar, 'hidden');
      }
    }
  }

}
