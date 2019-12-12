import { Component, OnInit, Renderer2 } from '@angular/core';

import { NavbarItem } from '../models/navbarItem';
import { Observable, fromEvent } from 'rxjs';
import { WindowService } from '../services/window.service';

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
    private window: WindowService
  ) { }

  ngOnInit() {
    this.list = [
      { title: 'Główna', icon: 'fa fa-home', href: '' },
      {
        title: 'Video', icon: 'fa fa-television', dropdown: [
          { title: 'MCU', icon: 'fa fa-angle-right', href: '/Base/MCU' },
          { title: 'Fox', icon: 'fa fa-angle-right', href: '/Base/Fox' }
        ]
      },
      {
        title: 'Komiksy', icon: 'fa fa-book', dropdown: [
          { title: 'Marvel Classic', icon: 'fa fa-angle-right', href: '/Base/Marvel_Classic' },
          { title: 'Marvel Now', icon: 'fa fa-angle-right', href: '/Base/Marvel_Now' },
          { title: 'Marvel Now 2.0', icon: 'fa fa-angle-right', href: '/Base/Marvel_Now2' },
          { title: 'Moje Komiksy', icon: 'fa fa-angle-right', href: '/Base/User' }
        ]
      },
      {
        title: 'Generator', icon: 'fa fa-building', dropdown: [
          { title: 'Marvel Classic', icon: 'fa fa-angle-right', href: '/Generator/Marvel_Classic' },
          { title: 'Marvel Now', icon: 'fa fa-angle-right', href: '/Generator/Marvel_Now' },
          { title: 'Marvel Now 2.0', icon: 'fa fa-angle-right', href: '/Generator/Marvel_Now2' },
          { title: 'Nowa Kolekcja', icon: 'fa fa-angle-right', href: '/Generator/New' },
          { title: 'Moje Komiksy', icon: 'fa fa-angle-right', href: '/Generator/User' }
        ]
      }
    ];
  }

  toolbar() {
    const toolbar = document.getElementsByClassName('toolbar')[0];
    if (toolbar) {
      if (toolbar.getAttribute('hidden') === null) {
        this.renderer.setAttribute(toolbar, 'hidden', 'true');
        this.window.setWindow(false);
      } else {
        this.renderer.removeAttribute(toolbar, 'hidden');
        this.window.setWindow(true);
      }
    }
  }

  secondClick() {
    let on = false;
    const observable = fromEvent(window, 'click').subscribe((event: MouseEvent) => {
      if (on) {
        observable.unsubscribe();
        if (event.pageY < 55) {
          const htmlElement = document.elementFromPoint(event.pageX, event.pageY) as HTMLElement;
          htmlElement.click();
        }
      } else { on = true; }
    });
  }

}
