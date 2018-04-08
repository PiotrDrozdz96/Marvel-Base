import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { CategoriesComponent } from './categories/categories.component';
import { DropdownService } from './services/dropdown.service';
import { ElementsComponent } from './elements/elements.component';
import { ElementComponent } from './element/element.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CategoriesComponent,
    ElementsComponent,
    ElementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DropdownService],
  bootstrap: [AppComponent]
})
export class AppModule { }
