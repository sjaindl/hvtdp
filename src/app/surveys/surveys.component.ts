import { Component, OnInit } from '@angular/core';
import { MysqlService } from '../services/mysql.service';
import { Survey } from '../shared/survey';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit {

  surveyLink: string = ''

  constructor(private mysqlService: MysqlService, private sanitizer: DomSanitizer) { 
  }

  ngOnInit() {
    this.mysqlService.getSurveyLink().subscribe(surveyLink => {
      if (surveyLink.length > 0) {
        this.surveyLink = surveyLink[0].link
        console.log(this.surveyLink)
      }
    })
  }

  surveyUrl() {
    //bypass Angular XSS security for trusted URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.surveyLink)
  }
}
