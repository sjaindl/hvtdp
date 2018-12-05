import { Component, OnInit } from '@angular/core';
import { Chef } from '../shared/chefs';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  chefs: Chef[]
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.mysqlService.getChefs()
      .subscribe((chefs: Chef[]) => this.chefs = chefs)
  }  
}
