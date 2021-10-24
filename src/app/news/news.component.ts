import { Component, OnInit } from '@angular/core'
import { News } from '../shared/news'
import { PageEvent } from '@angular/material/paginator'
import { baseUrlImages } from '../shared/baseurls'
import { MysqlService } from '../services/mysql.service'
import { ActivatedRoute } from '@angular/router'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[]
  selectedNews: News
  
  imageBaseUrl: String

  length: number
  pageSize: number

  pageSizeOptions: number[] = [1, 5, 10, 25, 100]

  // MatPaginator Output
  pageEvent: PageEvent

  newsId: number
  private sub: any
  initialOpen = true

  constructor(private mysqlService: MysqlService, private route: ActivatedRoute, private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getNews().subscribe( news => {
      this.news = news

      this.initPageEvent(5, 0)
      this.readRouteParams()
    })

    this.titleService.setTitle("HV TDP Stainz: News")
    this.metaTagService.updateTag({
      name: 'description', content: "Die aktuellsten News über den HV TDP Stainz"
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  readRouteParams() {
    if (this.route.params == null || this.news == null || this.news.length == 0) {
      return
    }

    this.sub = this.route.params.subscribe(params => {
      this.newsId = +params['newsId'] // (+) converts string 'newsId' to a number
      console.log(' news id: ' + this.newsId)

      //Load news details:
      var pageIndexToSelect = 0
      this.news.forEach(element => {
        if (element.newsId == this.newsId) {
          this.selectedNews = element

          console.log('selected news: ' + this.selectedNews.newsId)
          this.initPageEvent(1, pageIndexToSelect)
        }
        pageIndexToSelect++
      })
      
    })
  }

  initPageEvent(pageSize, pageIndex) {
    this.length = this.news.length
    this.pageSize = pageSize
    this.pageEvent = new PageEvent()
    
    this.pageEvent.length = this.length
    this.pageEvent.pageIndex = pageIndex
    this.pageEvent.pageSize = this.pageSize
  }

  opened() {
    if (!this.initialOpen) {
      this.selectedNews = null
    }
    
    this.initialOpen = false
  }
}
