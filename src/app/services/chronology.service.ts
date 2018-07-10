import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class ChronologyService {

  private chronology: Array<string> = [];
  private chronologyObs = new BehaviorSubject<Array<string>>(this.chronology);

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const baseLink = params.get('base');
      if (baseLink !== 'User' && baseLink !== 'New') {
        this.getJSON(baseLink).subscribe(data => {
          this.chronology = data;
          this.chronologyObs.next(data);
        });
      }
    });
  }

  private getJSON(baseLink: string): Observable<any> {
    return this.http.get('assets/data/' + baseLink + '/chronology.JSON');
  }

  get(): Observable<Array<string>> { return this.chronologyObs.asObservable(); }

  set(data) {
    this.chronology = data;
    this.chronologyObs.next(data);
  }

  download() {
    const blob = new Blob([JSON.stringify(this.chronology)], { type: 'text/csv' });
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'chronology.JSON';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
