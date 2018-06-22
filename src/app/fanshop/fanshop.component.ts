import { Component, OnInit } from '@angular/core';
import { ITEMS } from '../shared/items';

@Component({
  selector: 'app-fanshop',
  templateUrl: './fanshop.component.html',
  styleUrls: ['./fanshop.component.css']
})
export class FanshopComponent implements OnInit {

  items = ITEMS

  constructor() { }

  ngOnInit() {
  }
}
