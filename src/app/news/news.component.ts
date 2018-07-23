import { Component, OnInit } from '@angular/core';
import { NEWS, News } from '../shared/news';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[];

  length: number;
  pageSize: number;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor() { }

  ngOnInit() {
    this.length = NEWS.length
    this.pageSize = 5
    this.pageEvent =  new PageEvent()

    this.pageEvent.length = this.length
    this.pageEvent.pageIndex = 0
    this.pageEvent.pageSize = this.pageSize

    this.news = NEWS
  }
}
