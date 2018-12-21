import { OnInit } from '@angular/core';
import {
    CdkDragDrop,
    CdkDragExit,
    CdkDragEnter,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';

import { MarvelElement } from '../models/elements';


export abstract class GeneratorDragDrop implements OnInit {

    previousRowIndex: number;
    currentRowIndex: number;
    numberIssuesOnRow = 1;

    ngOnInit() {
    }

    drop(event: CdkDragDrop<string[]>) {
        this.blurOn(event);
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data,
                event.previousIndex, event.currentIndex - (this.currentRowIndex > this.previousRowIndex ? 1 : 0));
        }
    }

    singleDrop(event: CdkDragDrop<string[]>, array: Array<MarvelElement>) {
        moveItemInArray(array, event.previousIndex, event.currentIndex);
    }

    exit(event: CdkDragExit<string[]>, index: number) {
        this.previousRowIndex = index;
    }

    enter(event: CdkDragEnter<string[]>, index: number, matrixElements: Array<Array<MarvelElement>>) {
        if (this.previousRowIndex > (this.currentRowIndex = index)) {
            transferArrayItem(matrixElements[index],
                matrixElements[this.previousRowIndex],
                this.numberIssuesOnRow + 1,
                0);
        } else if (this.previousRowIndex < (this.currentRowIndex = index)) {
            transferArrayItem(matrixElements[index],
                matrixElements[this.previousRowIndex],
                0,
                this.numberIssuesOnRow + 1);
        }
    }

    blurOn(event: CdkDragDrop<string[]>) { }
}
