import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MysqlService } from '../services/mysql.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SurveysComponent implements OnInit {
  private mysqlService = inject(MysqlService);
  private sanitizer = inject(DomSanitizer);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  surveyLink: string = '';
  surveyId: string = '';

  ngOnInit() {
    this.mysqlService.getSurveyLink().subscribe((surveys) => {
      if (surveys.length > 0) {
        this.surveyLink = surveys[0].link;
        this.surveyId = surveys[0].id;
        console.log(this.surveyLink);
        console.log(this.surveyId);
      }
    });

    this.titleService.setTitle('HV TDP Stainz: Umfragen');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Aktuelle Umfragen über Ereignisse, Torschützen und Events des HV TDP Stainz.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);
  }

  surveyUrl() {
    //bypass Angular XSS security for trusted URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.surveyLink);
  }
}
