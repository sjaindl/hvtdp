import { Component, OnInit } from '@angular/core'
import { Chef } from '../shared/chefs'
import { baseUrlImages } from '../shared/baseurls'
import { MysqlService } from '../services/mysql.service'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  chefs: Chef[]
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService, private titleService: Title, private metaTagService: Meta) { }
  
  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getChefs()
      .subscribe((chefs: Chef[]) => this.chefs = chefs)

    this.titleService.setTitle("HV TDP Stainz: Über uns")
    this.metaTagService.updateTag({
      name: 'description', content: "Informationen über den HV TDP Stainz"
    })
  }
}
