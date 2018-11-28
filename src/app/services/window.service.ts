import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  countElementsInRow = 1;
  countElementsInRowObs = new BehaviorSubject<number>(1);
  handle = false;
  handleObs = new BehaviorSubject<boolean>(false);

  constructor() {
    this.setWindow(true);
  }

  getCountElements(): Observable<number> { return this.countElementsInRowObs.asObservable(); }
  getHandle(): Observable<boolean> { return this.handleObs.asObservable(); }
  setWindow(isToolbar: boolean) {
    const widthElement = window.outerWidth > 878 ? 220 : window.outerWidth > 592 ? 146 : 110;
    this.countElementsInRow = Math.floor((window.outerWidth - (isToolbar ? 155 : 0)) / widthElement - 0.25);
    this.countElementsInRow = this.countElementsInRow === 2 ? 1 : this.countElementsInRow;
    this.countElementsInRowObs.next(this.countElementsInRow);
    this.handle = ((window.outerWidth - (isToolbar ? 155 : 0)) / widthElement - 0.25) - this.countElementsInRow < 0.5;
    this.handleObs.next(this.handle);
    console.log(this.countElementsInRow);
  }
}
