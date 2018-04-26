import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { CategoriesComponent } from './categories/categories.component';
import { DropdownService } from './services/dropdown.service';
import { ElementsComponent } from './elements/elements.component';
import { ElementComponent } from './element/element.component';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChildElementsComponent } from './elements/child-elements.component';
import { LoadBaseDialog } from './dialogs/load-base/load-base.dialog';



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CategoriesComponent,
    ElementsComponent,
    ElementComponent,
    BaseComponent,
    HomeComponent,
    NotFoundComponent,
    ChildElementsComponent,
    LoadBaseDialog
  ],
  entryComponents: [
     LoadBaseDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'Base', component: NotFoundComponent },
      { path: 'Base/:base', component: BaseComponent , children: [
        { path: '', component: ElementsComponent},
        { path: ':id', component: ChildElementsComponent}
      ]},
      { path: '**', component: NotFoundComponent}
    ])
  ],
  providers: [DropdownService],
  bootstrap: [AppComponent]
})
export class AppModule { }
