import { Component, OnInit } from '@angular/core'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {

  constructor(private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle("HV TDP Stainz: Mitgliedschaft")
    this.metaTagService.updateTag({
      name: 'description', content: "Werde aktives oder förderndes Mitglied vom HV TDP Stainz."
    })
  }
}
