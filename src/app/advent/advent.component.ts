import { Component } from '@angular/core'
import { baseUrlImages } from '../shared/baseurls'
import { Title, Meta } from '@angular/platform-browser'
@Component({
  selector: 'app-advent',
  templateUrl: './advent.component.html',
  styleUrls: ['./advent.component.css']
})

export class AdventComponent {
  imageBaseUrl: string = ""
  
  constructor(private titleService: Title, private metaTagService: Meta) {
    this.imageBaseUrl = baseUrlImages

    this.titleService.setTitle("HV TDP Stainz: Adventkalender")
    this.metaTagService.updateTag({
      name: 'description', content: "Informationen über den HV TDP Stainz"
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }
}
