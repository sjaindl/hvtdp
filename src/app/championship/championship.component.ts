import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-championship',
  templateUrl: './championship.component.html',
  styleUrls: ['./championship.component.css']
})
export class ChampionshipComponent implements OnInit {

  tableLink = "https://www.meinspielplan.de/plan/3hjrgw?box=table&title=yes#https%3A%2F%2Fsued-weststeirischercup.jimdo.com%2Fspielbetrieb%2F";

  constructor(private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: Meisterschaft")
    this.metaTagService.updateTag({
      name: 'description', content: "Informationen über die Situation in der Meisterschaft vom HV TDP Stainz auf der offiziellen Seite des Grenzlandcups."
    })
  }
}
