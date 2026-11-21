import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';
import { Player } from '../shared/player';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { PlayerCardComponent } from '../ui/player-card/player-card.component';

interface PositionGroup {
  position: string;
  title: string;
  players: Player[];
}

const POSITION_ORDER = ['Tormann', 'Verteidiger', 'Mittelfeld', 'Stürmer'];
const GROUP_TITLES: Record<string, string> = {
  Tormann: 'Tormänner',
  Verteidiger: 'Verteidigung',
  Mittelfeld: 'Mittelfeld',
  Stürmer: 'Sturm',
};

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  standalone: true,
  imports: [EmptyStateComponent, PageIntroComponent, PlayerCardComponent],
})
export class TeamComponent implements OnInit {
  squadPlayers: Player[] = [];
  activePlayers: Player[] = [];
  positionGroups: PositionGroup[] = [];
  selectedPosition: string | null = null;
  loaded = false;
  failed = false;
  errorText = '';

  /** TODO(API): the date of the squad list is not part of the API. */
  readonly asOf = 'Stand 12/2025';

  constructor(
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit() {
    this.load();
    this.titleService.setTitle('HV TDP Stainz: Unsere Mannschaft');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Information über die Spieler im Kader des HV TDP Stainz.',
    });
  }

  load() {
    this.failed = false;
    this.mysqlService.getSquadPlayers().subscribe({
      next: (players) => {
        this.squadPlayers = this.sortPlayers(players);
        this.positionGroups = this.buildPositionGroups(this.squadPlayers);
        this.loaded = true;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
    this.mysqlService.getActivePlayers().subscribe((players) => (this.activePlayers = this.sortPlayers(players)));
  }

  get visibleGroups(): PositionGroup[] {
    return this.selectedPosition
      ? this.positionGroups.filter((group) => group.position === this.selectedPosition)
      : this.positionGroups;
  }

  get foundingMembers(): number {
    return this.squadPlayers.filter((player) => Number(player.memberSinceYear) === 2014).length;
  }

  get topScorer(): Player | null {
    return [...this.squadPlayers].sort((a, b) => Number(b.goals ?? 0) - Number(a.goals ?? 0))[0] ?? null;
  }

  private sortPlayers(players: Player[]): Player[] {
    return [...(players ?? [])].sort((a, b) =>
      (a?.lastName || '').localeCompare(b?.lastName || '', 'de-DE', { sensitivity: 'base' })
    );
  }

  private buildPositionGroups(players: Player[]): PositionGroup[] {
    const grouped = new Map<string, Player[]>();
    players.forEach((player) => {
      const key = player.position || 'Weitere Positionen';
      grouped.set(key, [...(grouped.get(key) ?? []), player]);
    });
    const rank = (position: string) => {
      const index = POSITION_ORDER.indexOf(position);
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };
    return [...grouped.entries()]
      .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b, 'de-DE'))
      .map(([position, groupPlayers]) => ({
        position,
        title: GROUP_TITLES[position] ?? position,
        players: groupPlayers,
      }));
  }
}
