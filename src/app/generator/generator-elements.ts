import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { GeneratorService } from '../services/generator.service';
import { SeriesService } from '../services/series.service';
import { CategoriesService } from '../services/categories.service';
import { BaseService } from '../services/base.service';
import { WindowService } from '../services/window.service';

import { MarvelElement } from '../models/elements';

import { EditElementDialog } from '../dialogs/edit-element/edit-element.dialog';
import { AddElementDialog } from '../dialogs/add-element/add-element.dialog';
import { GrabElementsDialog } from '../dialogs/grab-elements/grab-elements.dialog';
import { InstructionDialog } from '../dialogs/instruction/instruction.dialog';

import { GeneratorDragDrop } from './generator-drag-drop';

export abstract class GeneratorElements extends GeneratorDragDrop {

    matrixElements: Array<Array<MarvelElement>>;
    type: string;
    series: Array<string>;
    selectedSeries: string;
    activeElement: Element;

    constructor(
        public renderer: Renderer2,
        public generatorService: GeneratorService,
        public seriesService: SeriesService,
        public categoriesService: CategoriesService,
        public baseService: BaseService,
        public windowService: WindowService,
        public dialog: MatDialog
    ) { super(); }


    add(index: number) {
        const dialogRef = this.dialog.open(AddElementDialog, { width: '360px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) { this[result](index); }
        });
        this.blurOff();
    }

    addSingleElement(index: number) {
        const singleElementDialogRef = this.dialog.open(EditElementDialog, {
            data: {
                title: 'title',
                subTitle: 'subTtitle',
                publishedDate: 'publishedDate',
                id: '',
                volume: '',
                number: '',
                cover: '',
                series: [this.selectedSeries]
            }
        });
        singleElementDialogRef.afterClosed().subscribe(newElement => {
            this.generatorService.tryAddElement(newElement, index, this.type, this.series);
        });
        this.blurOff();
    }

    grabElements(index: number) {
        const grabElementsDialogRef = this.dialog.open(GrabElementsDialog);
        grabElementsDialogRef.afterClosed().subscribe(newElements => {
            this.generatorService.tryAddElements(
                newElements.map(element => Object.assign(element, { series: [this.selectedSeries] })),
                index, this.series);
        });
    }

    openInstruction(index: number) {
        this.dialog.open(InstructionDialog, { width: '360px' }).afterClosed().subscribe(result2 => {
            this.add(index);
        });
    }

    trash(element: MarvelElement, index: number) {
        this.generatorService.trash(element.id, index, this.type, this.series);
        this.blurOff();
    }

    edit(element: MarvelElement, index: number) {
        const dialogRef = this.dialog.open(EditElementDialog, { data: Object.assign({}, element) });
        dialogRef.afterClosed().subscribe(newElement => {
            this.generatorService.tryReplaceElement(newElement, index, element, this.type, this.series);
        });
        this.blurOff();
    }

    blurOn(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container &&
            event.previousIndex === event.currentIndex) {
            this.activeElement = document.getElementById(event.container.id).children[event.currentIndex].children[1];
            this.renderer.removeAttribute(this.activeElement, 'hidden');
            this.renderer.removeAttribute(document.getElementById('blur'), 'hidden');
        }
    }

    blurOff() {
        if (document.getElementById('blur') !== undefined) {
            this.renderer.setAttribute(document.getElementById('blur'), 'hidden', 'true');
        }
        if (this.activeElement !== undefined) {
            this.renderer.setAttribute(this.activeElement, 'hidden', 'true');
            this.activeElement = undefined;
        }
    }

}
