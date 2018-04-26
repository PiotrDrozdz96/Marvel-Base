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
import { GeneratorComponent } from './generator/generator.component';
import { GeneratorToolbarComponent } from './generator/generator-toolbar/generator-toolbar.component';
import { GeneratorViewComponent } from './generator/generator-view/generator-view.component';
import { GeneratorDeleteComponent } from './generator/generator-delete/generator-delete.component';
import { GeneratorEditComponent } from './generator/generator-edit/generator-edit.component';
import { GeneratorVolumesComponent } from './generator/generator-volumes/generator-volumes.component';
import { GeneratorChronologyComponent } from './generator/generator-chronology/generator-chronology.component';



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
    LoadBaseDialog,
    GeneratorComponent,
    GeneratorToolbarComponent,
    GeneratorViewComponent,
    GeneratorDeleteComponent,
    GeneratorEditComponent,
    GeneratorVolumesComponent,
    GeneratorChronologyComponent
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
      { path: 'Generator/:base', component: GeneratorComponent, children: [
        {path: '', redirectTo: 'view', pathMatch: 'full'},
        {path: 'view', component: GeneratorViewComponent},
        {path: 'delete', component: GeneratorDeleteComponent},
        {path: 'edit', component: GeneratorEditComponent},
        {path: 'volumes', component: GeneratorVolumesComponent},
        {path: 'chronology', component: GeneratorChronologyComponent},
      ]},
      { path: '**', component: NotFoundComponent}
    ])
  ],
  providers: [DropdownService],
  bootstrap: [AppComponent]
})
export class AppModule { }
