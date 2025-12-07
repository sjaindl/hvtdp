import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MysqlService } from '../services/mysql.service';
import { GoldenShot } from '../shared/goldenshot';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

const GOLDENSHOT_VOTING_COOKIE_KEY = 'goldenshot_voted';

@Component({
    selector: 'app-goldenshot-voting',
    templateUrl: './goldenshot-voting.component.html',
    styleUrls: ['./goldenshot-voting.component.css'],
    standalone: true,
    imports: [CommonModule, MatListModule, MatButtonModule]
})
export class GoldenshotVotingComponent implements OnInit {
  goldenShotOptions: GoldenShot[];

  canVote = false;

  isMobile = null;

  constructor(
    private mysqlService: MysqlService,
    private cookieService: CookieService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
    this.canVote = !this.cookieService.check(GOLDENSHOT_VOTING_COOKIE_KEY);

    this.mysqlService.getGoldenshot().subscribe((options) => {
      this.goldenShotOptions = options.sort((a, b) => {
        if (a.lastName < b.lastName) {
          return -1;
        } else if (a.lastName > b.lastName) {
          return 1;
        } else if (a.firstName < b.firstName) {
          return -1;
        } else if (a.firstName > b.firstName) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    this.checkDevice();
  }

  saveVote(vote: GoldenShot) {
    console.log('post vote', JSON.stringify(vote), vote.id);
    this.mysqlService.postGoldenShotVote(vote.id).subscribe((result) => {
      this.cookieService.set(GOLDENSHOT_VOTING_COOKIE_KEY, 'true', 1 / 24); // (peristent) cookie expires after 1 hour
      console.log(`response from server: ${JSON.stringify(result)}`);
      this.canVote = false;
    });
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
  }
}
