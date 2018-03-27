import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FilterComponent } from './filter/filter.component';
import { DropdownService } from './services/dropdown.service';
import { BaseComponent } from './base/base.component';
import { ElementComponent } from './element/element.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FilterComponent,
    BaseComponent,
    ElementComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DropdownService],
  bootstrap: [AppComponent]
})
export class AppModule { }
