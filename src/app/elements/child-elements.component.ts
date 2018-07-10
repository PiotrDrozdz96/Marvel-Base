import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../services/base.service';
import { MarvelElement } from '../models/elements';

@Component({
  selector: 'app-child-elements',
  templateUrl: './child-elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ChildElementsComponent implements OnInit {

  public parent: MarvelElement;
  public child: Array<MarvelElement>;

  constructor(private route: ActivatedRoute, private baseSerivce: BaseService) {
    this.route.paramMap.subscribe(params => {
      this.baseSerivce.getChilds(params.get('id'))
        .subscribe(arr => [this.parent, ...this.child] = [...arr] );
    });
  }

  ngOnInit() {
  }

}
