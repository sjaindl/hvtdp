import { Component, OnInit } from '@angular/core';
import { Donation } from '../shared/donations';
import { baseUrlImages } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {

  donations: Donation[]
  selectedDonation: Donation = null
  imageBaseUrl: String

  constructor(private mysqlService: MysqlService) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages
    
    this.mysqlService.getDonations().subscribe( donations => {
      this.donations = donations.sort((a, b) => {

        if (a.date < b.date) {
          return 1;
        } 
        else if (a.date > b.date) {
          return -1;
        }
        else {
          return 0;
        }
      });
  
      this.selectedDonation = null;
    })
  }

  selectDonation(donation: Donation) {
    this.selectedDonation = donation
  }

  back() {
    this.selectedDonation = null
  }
}
