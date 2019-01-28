import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  countElementsInRow = 1;
  countElementsInRowObs = new BehaviorSubject<number>(1);

  constructor() {
    this.setWindow(true);
  }

  getCountElements(): Observable<number> { return this.countElementsInRowObs.asObservable(); }
  setWindow(isToolbar: boolean) {
    const widthElement = window.outerWidth > 878 ? 220 : window.outerWidth > 592 ? 146 : 110;
    this.countElementsInRow = Math.floor((window.outerWidth - (isToolbar ? 155 : 0)) / widthElement - 0.25);
    this.countElementsInRow = this.countElementsInRow === 2 ? 1 : this.countElementsInRow;
    this.countElementsInRowObs.next(this.countElementsInRow);
  }
}
