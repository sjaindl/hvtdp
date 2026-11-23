import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ClubService } from '../services/club.service';
import { DocumentService } from '../services/document.service';
import { Member } from '../shared/member';
import { CLUB_EMAIL } from '../shared/seasons';
import { DateUtil } from '../shared/utils/date.util';
import { TextUtil } from '../shared/utils/text.util';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';

interface MemberGroup {
  title: string;
  members: string[];
  /** "Stand 11.09.2026" (from the team page in Strapi), or ''. */
  asOf: string;
}

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  standalone: true,
  imports: [PageIntroComponent],
})
export class MembershipComponent implements OnInit {
  private clubService = inject(ClubService);
  private documentService = inject(DocumentService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  /** The membership form is the Strapi document with the slug 'beitrittserklaerung'. */
  formUrl: string | null = null;
  readonly mailUrl = `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent('Mitgliedschaft HV TDP Stainz')}`;
  readonly email = CLUB_EMAIL;

  readonly steps = [
    {
      title: 'Beitrittserklärung herunterladen',
      text: 'Das PDF-Formular findest du hier auf der Seite.',
    },
    {
      title: 'Ausfüllen & unterschreiben',
      text: 'Ausgefüllt kannst du sie einscannen oder fotografieren.',
    },
    { title: 'Per E-Mail senden', text: `An ${CLUB_EMAIL} – wir melden uns bei dir.` },
  ];

  readonly types = [
    {
      icon: 'sports_soccer',
      title: 'Aktives Mitglied',
      text: 'Du kickst mit – bei Training, Meisterschaft und Turnieren.',
    },
    {
      icon: 'favorite',
      title: 'Förderndes Mitglied',
      text: 'Du unterstützt den Verein, ohne selbst am Ball zu sein.',
    },
    {
      icon: 'child_care',
      title: 'Kids Corner',
      text: 'Für unseren jüngsten Nachwuchs und die Fans von morgen.',
    },
  ];

  groups: MemberGroup[] = [
    { title: 'Aktive Mitglieder', members: [], asOf: '' },
    { title: 'Fördernde Mitglieder', members: [], asOf: '' },
    { title: 'Kids Corner', members: [], asOf: '' },
  ];

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Mitgliedschaft');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Werde aktives oder förderndes Mitglied vom HV TDP Stainz.',
    });

    this.documentService
      .getDocument('beitrittserklaerung')
      .subscribe((document) => (this.formUrl = document?.url ?? null));
    // Each list has its own "as of" date, maintained on the team page in Strapi.
    this.clubService.getTeamPage().subscribe((page) => {
      [page?.activeMembersAsOf, page?.supportingMembersAsOf, page?.kidsMembersAsOf].forEach(
        (date, index) =>
          (this.groups[index] = {
            ...this.groups[index],
            asOf: date ? `Stand ${DateUtil.formatDate(date)}` : '',
          })
      );
    });
    this.clubService.getMembers('Aktiv').subscribe((members) => this.setGroup(0, members));
    this.clubService.getMembers('Fördernd').subscribe((members) => this.setGroup(1, members));
    this.clubService.getMembers('Kids').subscribe((members) => this.setGroup(2, members));
  }

  private setGroup(index: number, members: Member[]) {
    const sorted = [...(members ?? [])].sort(
      (a, b) =>
        a.lastName.localeCompare(b.lastName, 'de-DE') ||
        a.firstName.localeCompare(b.firstName, 'de-DE')
    );
    this.groups[index] = {
      ...this.groups[index],
      members: sorted.map((member) => TextUtil.titleCase(`${member.firstName} ${member.lastName}`)),
    };
  }
}
