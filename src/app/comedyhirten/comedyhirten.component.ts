import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-comedyhirten',
  templateUrl: './comedyhirten.component.html',
  styleUrls: ['./comedyhirten.component.css']
})
export class ComedyhirtenComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaTagService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: Comedy Hirten")
    this.metaTagService.updateTag({
      name: 'description', content: "Bestelle hier deine Tickets für die Comedy Hirten - Kabarett beim HV TDP."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }
}
