import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ElementsService } from './elements.service';
import { ChronologyService } from './chronology.service';
import { CategoriesService } from './categories.service';

import { MarvelElement } from '../models/elements';

@Injectable()
export class BaseService {

    private base: Array<MarvelElement>;
    private baseObs = new BehaviorSubject<Array<MarvelElement>>(this.base);

    constructor(
        private elementsService: ElementsService,
        private chronologyService: ChronologyService,
        private categoriesService: CategoriesService
    ) {
        this.elementsService.get().subscribe(elements => {
            this.chronologyService.get().subscribe(chronology => {
                this.categoriesService.get().subscribe(categories => {

                    const series = Object.keys(categories).map(id =>
                        categories[id]).slice(1).reduce((arr, category) =>
                            arr.concat(category.series), []);
                    this.base = chronology.filter(id => elements[id] === undefined ? false :
                        elements[id].series.some(category =>
                            series.find(obj => obj.title === category).checked)).map(id => elements[id]);
                    this.baseObs.next(this.base);
                });
            });
        });
    }

    get(): Observable<Array<MarvelElement>> { return this.baseObs.asObservable(); }

}
