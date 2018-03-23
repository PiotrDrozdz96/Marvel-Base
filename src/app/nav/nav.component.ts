import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  onNavbarItem: any;

  constructor(private renderer: Renderer2) { }

  ngOnInit() { }

  dropdown(event: any) {
    const li = event.path[1];
    if (this.onNavbarItem) { this.renderer.removeClass(this.onNavbarItem, 'on'); }
    if (li !== this.onNavbarItem) {
      this.renderer.addClass(li, 'on');
      this.onNavbarItem = li;
    }

  }

}
