import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-stadionfest',
  templateUrl: './stadionfest.component.html',
  styleUrls: ['./stadionfest.component.css']
})
export class StadionFestComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaTagService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: Das legendäre Stadionfest")
    this.metaTagService.updateTag({
      name: 'description', content: "Bestelle hier deine Tickets für das legendäre Stadionfest des HV TDP Stainz."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }
}
