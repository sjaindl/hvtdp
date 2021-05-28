import { Component, OnInit } from '@angular/core'
import { PappFan } from '../shared/papp'
import { baseUrlImages } from '../shared/baseurls'
import { MysqlService } from '../services/mysql.service'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-hallofpapp',
  templateUrl: './hallofpapp.component.html',
  styleUrls: ['./hallofpapp.component.css']
})
export class HallofpappComponent implements OnInit {

  pappfans: PappFan[]
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService, private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages
    
    this.mysqlService.getPappfans().subscribe( fans => {
      this.pappfans = fans
    }) 

    this.titleService.setTitle("HV TDP Stainz: Papp-Fans")
    this.metaTagService.updateTag({
      name: 'description', content: "Papp-Fans des HV TDP Stainz."
    })
  }

}
