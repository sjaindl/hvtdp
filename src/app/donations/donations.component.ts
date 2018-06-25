import { Component, OnInit } from '@angular/core';
import { DONATIONS } from '../shared/donations';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit {

  donations = DONATIONS
  
  constructor() { }

  ngOnInit() {
  }

}
