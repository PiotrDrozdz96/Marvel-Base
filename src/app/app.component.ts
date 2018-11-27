import { Component } from '@angular/core';
import { CategoriesService } from './services/categories.service';
import { WindowService } from './services/window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WindowService]
})
export class AppComponent {

}
