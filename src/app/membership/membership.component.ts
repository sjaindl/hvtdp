import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { baseUrlDocuments } from '../shared/baseurls';
import { MysqlService } from '../services/mysql.service';
import { Member } from '../shared/member';

@Component({
    selector: 'app-membership',
    templateUrl: './membership.component.html',
    styleUrls: ['./membership.component.css'],
    standalone: false
})
export class MembershipComponent implements OnInit {
  documentBaseUrl: String;
  activeMembers: Member[];
  supportMembers: Member[];
  activePer: String;
  supportPer: String;

  constructor(
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Mitgliedschaft');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Werde aktives oder förderndes Mitglied vom HV TDP Stainz.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);

    this.documentBaseUrl = baseUrlDocuments;

    this.mysqlService.getActiveMembers().subscribe((members) => {
      this.activeMembers = members.sort((a, b) => {
        if (a.lastName < b.lastName) {
          return -1;
        } else if (a.lastName > b.lastName) {
          return 1;
        } else {
          if (a.firstName < b.firstName) {
            return -1;
          } else if (a.firstName > b.firstName) {
            return 1;
          } else {
            return 0;
          }
        }
      });

      this.activePer = this.activeMembers[0].per;
    });

    this.mysqlService.getSupportMembers().subscribe((members) => {
      this.supportMembers = members.sort((a, b) => {
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

      this.supportPer = this.supportMembers[0].per;
    });
  }
}
