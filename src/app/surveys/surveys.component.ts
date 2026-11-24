import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';

/** Only SurveyHero embed scripts are loaded (the link comes from the survey API). */
const SURVEYHERO_SCRIPT = /^https:\/\/embed-cdn\.surveyhero\.com\/js\/user\/embed\.[a-z0-9]+\.js$/;

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SurveysComponent implements OnInit {
  private mysqlService = inject(MysqlService);
  private document = inject(DOCUMENT);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  surveyLink: string = '';
  surveyId: string = '';

  ngOnInit() {
    this.mysqlService.getSurveyLink().subscribe((surveys) => {
      if (surveys.length > 0) {
        this.surveyLink = surveys[0].link;
        this.surveyId = surveys[0].id;
        // The embed script looks for its container, so it is added once the container is rendered.
        setTimeout(() => this.loadSurveyScript(this.surveyLink));
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

  private loadSurveyScript(link: string) {
    if (!SURVEYHERO_SCRIPT.test(link) || this.document.querySelector(`script[src="${link}"]`)) {
      return;
    }
    const script = this.document.createElement('script');
    script.src = link;
    script.async = true;
    this.document.body.appendChild(script);
  }
}
