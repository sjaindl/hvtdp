import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'HVTDP';

  items: Array<any> = []
  
  constructor() { 
    this.items = [
      { name: 'assets/images/schnitti.JPG' },
      { name: 'assets/images/sinci.JPG' },
      { name: 'assets/images/schnitti.JPG' },
      { name: 'assets/images/sinci.JPG' },
      { name: 'assets/images/schnitti.JPG' },
      { name: 'assets/images/schnitti.JPG' },
      { name: 'assets/images/schnitti.JPG' },
      { name: 'assets/images/schnitti.JPG' },
      { name: 'assets/images/schnitti.JPG' },
      { name: 'assets/images/sinci.JPG' }
    ]
  }

  ngOnInit() {

  }

}
