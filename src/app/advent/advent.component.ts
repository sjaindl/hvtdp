import { Component } from '@angular/core'
import { baseUrlImages } from '../shared/baseurls'
import { DeviceDetectorService } from '../../../node_modules/ngx-device-detector'
import { Title, Meta } from '@angular/platform-browser'
import { List } from 'postcss/lib/list'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-advent',
  templateUrl: './advent.component.html',
  styleUrls: ['./advent.component.css']
})

export class AdventComponent {
  imageBaseUrl: string = ""
  isMobile = null
  season: string

  private sub: any

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    private deviceService: DeviceDetectorService,
    private route: ActivatedRoute) {
    //this.imageBaseUrl = baseUrlImages

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

  ngOnInit() {
    this.checkDevice()

    this.sub = this.route.params.subscribe(params => {
      this.season = params['season']

    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile()
  }

  curDay(): number {
    if(this.season == '2023') return 1

    var now = new Date()
    //var day = Math.min(now.getUTCDate(), 24)
    var day = 24

    if (now.getUTCHours() < 11) {
      return day - 1
    }
    return day
  }

  dayRange(): number[] {
    if(this.season == '2023') return [1]

    return Array.from(Array(this.curDay())).map((_, idx) => idx + 1).reverse()
  }
}
