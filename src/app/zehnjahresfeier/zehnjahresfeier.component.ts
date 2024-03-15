import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-zehnjahresfeier',
  templateUrl: './zehnjahresfeier.component.html',
  styleUrls: ['./zehnjahresfeier.component.css']
})
export class ZehnjahresfeierComponent implements OnInit {
  constructor(
    private titleService: Title,
    private metaTagService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: 10-Jahresjubiläum")
    this.metaTagService.updateTag({
      name: 'description', content: "Bestelle hier deine Tickets für das 10-Jahresjubiläum des HV TDP Stainz."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }
}
