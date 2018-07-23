import { Component, OnInit } from '@angular/core';
import { NEWS, News } from '../shared/news';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'HV TDP Stainz';

  items: Array<any> = []
  
  constructor() { 
    this.items = NEWS
  }

  ngOnInit() {
  }

}
