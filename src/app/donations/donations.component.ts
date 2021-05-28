import { Component, OnInit } from '@angular/core'
import { Donation } from '../shared/donations'
import { baseUrlImages } from '../shared/baseurls'
import { MysqlService } from '../services/mysql.service'
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {

  donations: Donation[]
  selectedDonation: Donation = null
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService, private titleService: Title, private metaTagService: Meta) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages
    
    this.mysqlService.getDonations().subscribe( donations => {
      this.donations = donations.sort((a, b) => {

        if (a.date < b.date) {
          return 1
        } 
        else if (a.date > b.date) {
          return -1
        }
        else {
          return 0
        }
      })
  
      this.selectedDonation = null
    })

    this.titleService.setTitle("HV TDP Stainz: Matchballspenden")
    this.metaTagService.updateTag({
      name: 'description', content: "Die Matchballspenden und Förderer des HV TDP Stainz."
    })
  }

  selectDonation(donation: Donation) {
    this.selectedDonation = donation
  }

  back() {
    this.selectedDonation = null
  }
}
