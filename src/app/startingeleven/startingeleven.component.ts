import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-startingeleven',
  templateUrl: './startingeleven.component.html',
  styleUrls: ['./startingeleven.component.css']
})
export class StartingelevenComponent implements OnInit {

  constructor(private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("Starting Eleven")
    this.metaTagService.updateTag({
      name: 'description', content: "Starting Eleven"
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

}
