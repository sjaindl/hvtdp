import { Component, OnInit } from '@angular/core';
import { News } from '../shared/news';
import { PageEvent } from '@angular/material';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[]
  imageBaseUrl: String

  length: number
  pageSize: number

  pageSizeOptions: number[] = [5, 10, 25, 100]

  // MatPaginator Output
  pageEvent: PageEvent

  constructor(private mysqlService: MysqlService) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getNews().subscribe( news => {
      this.news = news

      this.length = news.length
      this.pageSize = 5
      this.pageEvent =  new PageEvent()

      this.pageEvent.length = this.length
      this.pageEvent.pageIndex = 0
      this.pageEvent.pageSize = this.pageSize
    })
  }
}
