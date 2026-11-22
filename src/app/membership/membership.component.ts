import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ClubService } from '../services/club.service';
import { baseUrlDocuments } from '../shared/baseurls';
import { Member } from '../shared/member';
import { CLUB_EMAIL } from '../shared/seasons';
import { DateUtil } from '../shared/utils/date.util';
import { TextUtil } from '../shared/utils/text.util';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';

interface MemberGroup {
  title: string;
  members: string[];
  per: string;
}

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  standalone: true,
  imports: [PageIntroComponent],
})
export class MembershipComponent implements OnInit {
  private clubService = inject(ClubService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);

  readonly formUrl = baseUrlDocuments + 'beitrittserklaerung.pdf';
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
    { title: 'Aktive Mitglieder', members: [], per: '' },
    { title: 'Fördernde Mitglieder', members: [], per: '' },
    { title: 'Kids Corner', members: [], per: '' },
  ];

  ngOnInit() {
    this.titleService.setTitle('HV TDP Stainz: Mitgliedschaft');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Werde aktives oder förderndes Mitglied vom HV TDP Stainz.',
    });

    this.clubService.getMembers('Aktiv').subscribe((members) => this.setGroup(0, members));
    this.clubService.getMembers('Fördernd').subscribe((members) => this.setGroup(1, members));
    this.clubService.getMembers('Kids').subscribe((members) => this.setGroup(2, members));
  }

  get asOf(): string {
    return [...new Set(this.groups.map((group) => group.per).filter(Boolean))]
      .map((per) => `Stand ${per}`)
      .join(' · ');
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
      // The list is as of the latest date of its members.
      per: DateUtil.formatDate(
        sorted
          .map((member) => member.since ?? '')
          .sort()
          .pop() ?? ''
      ),
    };
  }
}
