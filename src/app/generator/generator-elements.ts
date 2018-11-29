import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
    CdkDragDrop, CdkDragExit, CdkDragEnter,
    moveItemInArray, transferArrayItem
} from '@angular/cdk/drag-drop';

import { listToMatrix } from '../functions/listToMatrix';

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

export abstract class GeneratorElements implements OnInit {

    @ViewChild('base') baseRef: ElementRef;

    matrixElements: Array<Array<MarvelElement>>;
    type: string;
    series: Array<string>;
    selectedSeries: string;
    previousRowIndex: number;
    currentRowIndex: number;
    numberIssuesOnRow = 1;
    activeElement: Element;

    constructor(
        public renderer: Renderer2,
        public generatorService: GeneratorService,
        public seriesService: SeriesService,
        public categoriesService: CategoriesService,
        public baseService: BaseService,
        public windowService: WindowService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
    }

    add(index: number) {
        const dialogRef = this.dialog.open(AddElementDialog, { width: '360px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'singleElement') {
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
            } else if (result === 'grabElements') {
                const grabElementsDialogRef = this.dialog.open(GrabElementsDialog);
                grabElementsDialogRef.afterClosed().subscribe(newElements => {
                    this.generatorService.tryAddElements(
                        newElements.map(element => Object.assign(element, { series: [this.selectedSeries] })),
                        index, this.series);
                });
            } else if (result === 'instruction') {
                this.dialog.open(InstructionDialog, { width: '360px' }).afterClosed().subscribe(result2 => {
                    this.add(index);
                });
            }
        });
        this.blurOff();
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

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container &&
            event.previousIndex === event.currentIndex) {
            this.activeElement = document.getElementById(event.container.id).children[event.currentIndex].children[1];
            this.renderer.removeAttribute(this.activeElement, 'hidden');
            this.renderer.removeAttribute(document.getElementById('blur'), 'hidden');
        } else if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex,
                event.currentIndex - (this.currentRowIndex > this.previousRowIndex ? 1 : 0));
            this.seriesService.update(this.selectedSeries, this.type, [].concat(...this.matrixElements).map(e => e.id));
            this.previousRowIndex = this.currentRowIndex = 0;
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data,
                event.previousIndex, event.currentIndex - (this.currentRowIndex > this.previousRowIndex ? 1 : 0));
            this.seriesService.update(this.selectedSeries, this.type, [].concat(...this.matrixElements).map(e => e.id));
            this.previousRowIndex = this.currentRowIndex = 0;
        }
    }

    singleDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.matrixElements[0], event.previousIndex, event.currentIndex);
        this.seriesService.update(this.selectedSeries, this.type, [].concat(...this.matrixElements).map(e => e.id));
    }

    exit(event: CdkDragExit<string[]>, index: number) {
        this.previousRowIndex = index;
    }

    enter(event: CdkDragEnter<string[]>, index: number) {
        if (this.previousRowIndex > (this.currentRowIndex = index)) {
            transferArrayItem(this.matrixElements[index],
                this.matrixElements[this.previousRowIndex],
                this.numberIssuesOnRow + 1,
                0);
        } else if (this.previousRowIndex < (this.currentRowIndex = index)) {
            transferArrayItem(this.matrixElements[index],
                this.matrixElements[this.previousRowIndex],
                0,
                this.numberIssuesOnRow + 1);
        }
    }

    blurOff() {
        this.renderer.setAttribute(document.getElementById('blur'), 'hidden', 'true');
        this.renderer.setAttribute(this.activeElement, 'hidden', 'true');
        this.activeElement = undefined;
    }

}
