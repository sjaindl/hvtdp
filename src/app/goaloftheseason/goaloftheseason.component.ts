import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core'
import { Game, Link, GameLinkFlat } from '../shared/games'
import { Player } from '../shared/player'
import { baseUrlImages } from '../shared/baseurls'
import { MysqlService } from '../services/mysql.service'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Title, Meta } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-goaloftheseason',
  templateUrl: './goaloftheseason.component.html',
  styleUrls: ['./goaloftheseason.component.css']
})
export class GoalOfTheSeasonComponent implements OnInit {

  games: Game[]
  links: GameLinkFlat[] = []
  season: string
  players: Player[]
  imageBaseUrl: String
  isMobile = null

  private sub: any

  constructor(
    private mysqlService: MysqlService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.imageBaseUrl = baseUrlImages

    this.checkDevice()

    this.sub = this.route.params.subscribe(params => {
      this.season = params['season']

      this.mysqlService.getGames().subscribe(games => {
        games.forEach((game) => {
          var links = game.links.filter((link) => link.goalOfSeasonCandidate == 1)
          console.log(links.length)
          links.forEach(link => {
            let flat = new GameLinkFlat(game.season, game.round, game.description, game.date, link, game.customText)
            console.log(flat)
            this.links.push(flat)
          })

          return game.season == this.season && links.length > 0
        })
      })

      this.mysqlService.getPlayers().subscribe(players => {
        this.players = players
      })
    })

    this.titleService.setTitle("HV TDP Stainz: Tor der Saison")
    this.metaTagService.updateTag({
      name: 'description', content: "Wähle das Tor der Saison vom HV TDP Stainz."
    })

    this.metaTagService.addTags([
      { name: 'keywords', content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz' },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' }
    ])
  }

  ngAfterViewInit() {
    this.cdr.detectChanges()
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkDevice()
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile()
  }

  matches(name: string, player: Player) {
    if (name.includes(" ")) {
        return (player.lastName + ' ' + player.firstName) == name
    }

    return player.lastName == name
  }

  reload() {
    window.location.reload();
  }
}
