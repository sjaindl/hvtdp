import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.css']
})
export class ChampionshipComponent implements OnInit {

  tableLink = "https://www.meinspielplan.de/plan/3hjrgw?box=table&title=yes#https%3A%2F%2Fsued-weststeirischercup.jimdo.com%2Fspielbetrieb%2F";

  constructor() { }

  ngOnInit() {
  }

}
