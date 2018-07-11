import { Component, OnInit } from '@angular/core';
import { DONATIONS, Donations } from '../shared/donations';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {

  donations: Donations[]
  selectedDonation: Donations = null

  constructor() {
   }

  initialize() {
    this.donations = DONATIONS.sort((a, b) => {

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
  }

  ngOnInit() {
    this.initialize()
  }

  selectDonation(donation: Donations) {
    this.selectedDonation = donation
  }

  back() {
    this.selectedDonation = null
  }

}
