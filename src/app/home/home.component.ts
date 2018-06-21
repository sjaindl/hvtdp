import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = '1. HVTDP Stainz';

  items: Array<any> = []
  
  constructor() { 
    this.items = [
      { name: 'assets/images/news/news1.jpg' },
      { name: 'assets/images/news/news2.jpg' }
    ]
  }

  ngOnInit() {

  }

}
