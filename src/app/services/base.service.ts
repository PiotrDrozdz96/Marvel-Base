import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ElementsService } from './elements.service';
import { ChronologyService } from './chronology.service';
import { CategoriesService } from './categories.service';

import { MarvelElement } from '../models/elements';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class BaseService {

    private base: Array<MarvelElement>;
    private baseObs = new BehaviorSubject<Array<MarvelElement>>(this.base);

    constructor(
        private route: ActivatedRoute,
        private elementsService: ElementsService,
        private chronologyService: ChronologyService,
        private categoriesService: CategoriesService
    ) {
        this.route.paramMap.subscribe(params => {
            const baseLink = params.get('base');
            this.elementsService.set(baseLink);
            this.chronologyService.set(baseLink);
            this.categoriesService.set(baseLink);
        });

        this.categoriesService.get().subscribe(categories => {
            this.elementsService.get().subscribe(elements => {
                this.chronologyService.get().subscribe(chronology => {

                    const series = Object.values(categories).slice(1)
                        .reduce((arr, category) => arr.concat(category.series), []);

                    this.base = chronology.filter(id => elements[id] === undefined ? false :
                        elements[id].series.some(category => {
                            const finded = series.find(obj => obj.title === category);
                            return finded !== undefined ? finded.checked : false; })
                        ).map(id => elements[id]);
                    this.baseObs.next(this.base);
                });
            });
        });
    }

    get(): Observable<Array<MarvelElement>> { return this.baseObs.asObservable(); }

}
