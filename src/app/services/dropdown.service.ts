import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class DropdownService {

  constructor() { }

    dropdown(renderer: Renderer2, on: any, el: any) {
        if (on) {
            renderer.removeClass(on, 'on');
          }

          if (el !== on) {
            renderer.addClass(el, 'on');
            return el;
          } else { return undefined; }
    }

}
