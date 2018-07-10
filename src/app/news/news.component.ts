import { Component, OnInit } from '@angular/core';
import { NEWS, News } from '../shared/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[];

  constructor() { }

  ngOnInit() {
    this.news = NEWS.sort((a, b) => {

      if (a.newsDate < b.newsDate) {
        return 1;
      } 
      else if (a.newsDate > b.newsDate) {
        return -1;
      }
      else {
          return 0;
      }
    });
  }

}
