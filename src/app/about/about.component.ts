import { Component, OnInit } from '@angular/core';
import { CHEFS, Chef } from '../shared/chefs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  chefs: Chef[];

  constructor() { }

  ngOnInit() {
    this.chefs = CHEFS;
  }

}
