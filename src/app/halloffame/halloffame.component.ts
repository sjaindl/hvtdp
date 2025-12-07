import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-halloffame',
    templateUrl: './halloffame.component.html',
    styleUrls: ['./halloffame.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class HalloffameComponent implements OnInit {
  constructor(private titleService: Title, private metaTagService: Meta) {}

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Galerie');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Die Hall of Fame des HV TDP Stainz.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);
  }
}
