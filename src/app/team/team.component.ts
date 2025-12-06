import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Meta, Title } from '@angular/platform-browser';
import { HvtdpImageComponent } from '../hvtdp-image/hvtdp-image.component';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Player } from '../shared/player';

interface PositionGroup {
  position: string;
  icon: string;
  players: Player[];
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  standalone: true,
  imports: [HvtdpImageComponent, MatIconModule],
})
export class TeamComponent implements OnInit {
  squadPlayers: Player[] = [];
  activePlayers: Player[] = [];
  positionGroups: PositionGroup[] = [];
  imageBaseUrl: string = baseUrlImages as string;

  private readonly positionOrder: string[] = ['Tormann', 'Verteidiger', 'Mittelfeld', 'Stürmer'];

  constructor(
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.mysqlService.getSquadPlayers().subscribe((players) => {
      this.squadPlayers = this.sortPlayers(players);
      this.buildPositionGroups();
    });

    this.mysqlService.getActivePlayers().subscribe((players) => {
      this.activePlayers = this.sortPlayers(players);
    });

    this.titleService.setTitle('HV TDP Stainz: Unsere Mannschaft');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Information über die Spieler im Kader des HV TDP Stainz.',
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

  private sortPlayers(players: Player[]): Player[] {
    return [...(players ?? [])].sort((a, b) => {
      const lastNameA = (a?.lastName || '').toLocaleLowerCase('de-DE');
      const lastNameB = (b?.lastName || '').toLocaleLowerCase('de-DE');
      return lastNameA.localeCompare(lastNameB, 'de-DE');
    });
  }

  private buildPositionGroups(): void {
    if (!this.squadPlayers?.length) {
      this.positionGroups = [];
      return;
    }

    const grouped = new Map<string, Player[]>();

    this.squadPlayers.forEach((player) => {
      const key = player.position || 'Weitere Positionen';
      const currentGroup = grouped.get(key) ?? [];
      currentGroup.push(player);
      grouped.set(key, currentGroup);
    });

    this.positionGroups = Array.from(grouped.entries())
      .sort((a, b) => this.comparePositions(a[0], b[0]))
      .map(([position, players]) => ({
        position,
        icon: this.getPositionIcon(position),
        players: this.sortPlayers(players),
      }));
  }

  private comparePositions(a: string, b: string): number {
    const indexA = this.positionOrder.indexOf(a);
    const indexB = this.positionOrder.indexOf(b);
    const normalizedA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const normalizedB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

    if (normalizedA !== normalizedB) {
      return normalizedA - normalizedB;
    }

    return a.localeCompare(b, 'de-DE');
  }

  getPositionIcon(position: string): string {
    switch (position) {
      case 'Tormann':
        return '🧤';
      case 'Verteidiger':
        return '🛡️';
      case 'Mittelfeld':
        return '⚡';
      case 'Stürmer':
        return '⚽';
      default:
        return '⭐';
    }
  }

  getPlayerNumber(player: Player): number | undefined {
    const jersey = player?.jerseyNumber ?? player?.number;
    return jersey === undefined ? undefined : jersey;
  }

  getMemberSince(player: Player): string {
    if (player?.memberSinceDate) {
      return this.formatDate(player.memberSinceDate);
    }

    if (player?.memberSinceYear) {
      return `${player.memberSinceYear}`;
    }

    return 'unbekannt';
  }

  private formatDate(dateString: string): string {
    const parsedDate = new Date(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
      return dateString;
    }

    return parsedDate.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
