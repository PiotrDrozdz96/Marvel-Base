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
import { EditElementComponent } from './element/edit-element.component';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChildElementsComponent } from './elements/child-elements.component';
import { LoadBaseDialog } from './dialogs/load-base/load-base.dialog';
import { EditElementDialog } from './dialogs/edit-element/edit-element.dialog';
import { ConflictElementsDialog } from './dialogs/conflict-elements/conflict-elements.dialog';
import { AddElementDialog } from './dialogs/add-element/add-element.dialog';
import { GrabElementsDialog } from './dialogs/grab-elements/grab-elements.dialog';
import { ConflictGrabElementsDialog } from './dialogs/conflict-grab-elements/conflict-grab-elements.dialog';
import { GeneratorComponent } from './generator/generator.component';
import { GeneratorToolbarComponent } from './generator/generator-toolbar/generator-toolbar.component';
import { GeneratorIssuesComponent } from './generator/generator-issues/generator-issues.component';
import { GeneratorVolumesComponent } from './generator/generator-volumes/generator-volumes.component';
import { GeneratorChronologyComponent } from './generator/generator-chronology/generator-chronology.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CategoriesComponent,
    ElementsComponent,
    ElementComponent,
    EditElementComponent,
    BaseComponent,
    HomeComponent,
    NotFoundComponent,
    ChildElementsComponent,
    LoadBaseDialog,
    EditElementDialog,
    ConflictElementsDialog,
    AddElementDialog,
    GrabElementsDialog,
    ConflictGrabElementsDialog,
    GeneratorComponent,
    GeneratorToolbarComponent,
    GeneratorIssuesComponent,
    GeneratorVolumesComponent,
    GeneratorChronologyComponent
  ],
  entryComponents: [
     LoadBaseDialog,
     EditElementDialog,
     ConflictElementsDialog,
     AddElementDialog,
     GrabElementsDialog,
     ConflictGrabElementsDialog
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
        {path: '', redirectTo: 'issues', pathMatch: 'full'},
        {path: 'issues', component: GeneratorIssuesComponent},
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
