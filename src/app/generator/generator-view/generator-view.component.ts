import { Component, OnInit } from '@angular/core';
import { GeneratorService } from '../../services/generator.service';

@Component({
  selector: 'app-generator-view',
  templateUrl: './generator-view.component.html',
  styleUrls: ['./generator-view.component.css']
})
export class GeneratorViewComponent implements OnInit {

  selectedSeries: string;

  constructor(private generatorService: GeneratorService) {
    generatorService.getSelectedSeries().subscribe(selectedSeries => {
      this.selectedSeries = selectedSeries;
    });
  }

  ngOnInit() {
  }

}
