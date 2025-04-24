import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player } from '../shared/player';
import { Chef } from '../shared/chefs';
import { Donation } from '../shared/donations';
import { Item } from '../shared/items';
import { News } from '../shared/news';
import { Game } from '../shared/games';
import { Album } from '../shared/photos';
import { HvtdpDocument } from '../shared/document';
import { Ticker } from '../shared/ticker';
import { Survey } from '../shared/survey';
import { PappFan } from '../shared/papp';
import { Member } from '../shared/member';
import { Validation } from '../shared/validation';
import { Standing } from '../shared/standing';
import { Scorer } from '../shared/scorer';
import { GoldenShot } from '../shared/goldenshot';
import { GoalOfTheSeason } from '../shared/goaloftheseason';
import { PlayerOfTheSeason } from '../shared/playeroftheseason';

@Injectable()
export class MysqlService {

  constructor(private http: HttpClient) { }

  public getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>('https://www.hvtdpstainz.at/api/getPlayers.php')
  }

  public getSquadPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>('https://www.hvtdpstainz.at/api/getSquadPlayers.php')
  }

  public getActivePlayers(): Observable<Player[]> {
    return this.http.get<Player[]>('https://www.hvtdpstainz.at/api/getActivePlayers.php')
  }

  public getChefs(): Observable<Chef[]> {
    return this.http.get<Chef[]>('https://www.hvtdpstainz.at/api/getChefs.php')
  }

  public getDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>('https://www.hvtdpstainz.at/api/getDonations.php')
  }

  public getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('https://www.hvtdpstainz.at/api/getItems.php')
  }

  public getNews(): Observable<News[]> {
    return this.http.get<News[]>('https://www.hvtdpstainz.at/api/getNews.php')
  }

  public getGames(): Observable<Game[]> {
    return this.http.get<Game[]>('https://www.hvtdpstainz.at/api/getGames.php')
  }

  public getPhotos(): Observable<Album[]> {
    return this.http.get<Album[]>('https://www.hvtdpstainz.at/api/getPhotos.php')
  }

  public getDocuments(): Observable<HvtdpDocument[]> {
    return this.http.get<HvtdpDocument[]>('https://www.hvtdpstainz.at/api/getDocuments.php')
  }

  public getTickerItems(): Observable<Ticker[]> {
    return this.http.get<Ticker[]>('https://www.hvtdpstainz.at/api/getTicker.php')
  }

  public getSurveyLink(): Observable<Survey[]> {
    return this.http.get<Survey[]>('https://www.hvtdpstainz.at/api/getSurvey.php')
  }

  public getPappfans(): Observable<PappFan[]> {
    return this.http.get<PappFan[]>('https://www.hvtdpstainz.at/api/getPappfans.php')
  }

  public getActiveMembers(): Observable<Member[]> {
    return this.http.get<Member[]>('https://www.hvtdpstainz.at/api/getActiveMembership.php')
  }

  public getSupportMembers(): Observable<Member[]> {
    return this.http.get<Member[]>('https://www.hvtdpstainz.at/api/getSupportMembership.php')
  }

  public getStandings(): Observable<Standing[]> {
    return this.http.get<Standing[]>('https://www.hvtdpstainz.at/api/getStandings.php')
  }

  public getScorers(): Observable<Scorer[]> {
    return this.http.get<Scorer[]>('https://www.hvtdpstainz.at/api/getScorers.php')
  }

  public checkPassword(password: string): Observable<Validation[]> {
    return this.http.get<Validation[]>('https://www.hvtdpstainz.at/api/checkPasswordValid.php', {
      params: new HttpParams().set("password", password)
    } )
  }

  public postDuckrun(firstname: string, lastname: string, mail: string, phone: string, address: string, duckcount: number): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postDuckrun.php?'
    url += 'firstname=' + firstname
    url += '&lastname=' + lastname
    url += '&mail=' + mail
    url += '&phone=' + phone
    url += '&address=' + address
    url += '&duckcount=' + duckcount
    url += '&useragent=' + window.navigator.userAgent
    url += '&language=' + window.navigator.language
    url += '&platform=' + window.navigator.platform

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('firstname', firstname)
      .append('lastname', lastname)
      .append('mail', mail)
      .append('phone', phone)
      .append('address', address)
      .append('duckcount',  ""+duckcount)
      .append('useragent', window.navigator.userAgent)
      .append('language', window.navigator.language)
      .append('platform', window.navigator.platform)
    })
  }

  public postHallenturnier(
    name: string,
    mail: string,
    // phone: string,
    teamname: string,
    // day: string
  ): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postHallenturnier.php?'
    url += '&name=' + name
    url += '&mail=' + mail
    // url += '&phone=' + phone
    url += '&teamname=' + teamname
    // url += '&day=' + day
    url += '&useragent=' + window.navigator.userAgent
    url += '&language=' + window.navigator.language
    url += '&platform=' + window.navigator.platform

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('name', name)
      .append('mail', mail)
      // .append('phone', phone)
      .append('teamname', teamname)
      // .append('day', day)
      .append('useragent', window.navigator.userAgent)
      .append('language', window.navigator.language)
      .append('platform', window.navigator.platform)
    })
  }

  public postBigdarts(
    name: string,
    mail: string,
    // phone: string,
    teamname: string,
    // day: string
  ): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postBigDarts.php?'
    url += '&name=' + name
    url += '&mail=' + mail
    // url += '&phone=' + phone
    url += '&teamname=' + teamname
    // url += '&day=' + day
    url += '&useragent=' + window.navigator.userAgent
    url += '&language=' + window.navigator.language
    url += '&platform=' + window.navigator.platform

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('name', name)
      .append('mail', mail)
      // .append('phone', phone)
      .append('teamname', teamname)
      // .append('day', day)
      .append('useragent', window.navigator.userAgent)
      .append('language', window.navigator.language)
      .append('platform', window.navigator.platform)
    })
  }

  public postTurnier(name: string, mail: string, phone: string, teamname: string): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postKleinfeldturnier.php?'
    url += '&name=' + name
    url += '&mail=' + mail
    url += '&phone=' + phone
    url += '&teamname=' + teamname
    url += '&useragent=' + window.navigator.userAgent
    url += '&language=' + window.navigator.language
    url += '&platform=' + window.navigator.platform

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('name', name)
      .append('mail', mail)
      .append('phone', phone)
      .append('teamname', teamname)
      .append('useragent', window.navigator.userAgent)
      .append('language', window.navigator.language)
      .append('platform', window.navigator.platform)
    })
  }

  public getGoldenshot(): Observable<GoldenShot[]> {
    return this.http.get<GoldenShot[]>('https://www.hvtdpstainz.at/api/getGoldenShot.php')
  }

  public postGoldenShotRegistration(firstName: string, lastName: string, mail: string, phone: string, photo: string): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postGoldenShot.php?'
    url += '&firstName=' + firstName
    url += '&lastName=' + lastName
    url += '&mail=' + mail
    url += '&phone=' + phone
    url += '&photo=' + photo
    url += '&useragent=' + window.navigator.userAgent
    url += '&language=' + window.navigator.language
    url += '&platform=' + window.navigator.platform

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('firstName', firstName)
      .append('lastName', lastName)
      .append('mail', mail)
      .append('phone', phone)
      .append('photo', photo)
      .append('useragent', window.navigator.userAgent)
      .append('language', window.navigator.language)
      .append('platform', window.navigator.platform)
    })
  }

  public postGoldenShotVote(id: string): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postGoldenShotVote.php?'

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('id', id)
    })
  }

  public getGoalOfTheSeason(): Observable<GoalOfTheSeason[]> {
    return this.http.get<GoalOfTheSeason[]>('https://www.hvtdpstainz.at/api/getGoalOfTheSeason.php')
  }

  public postGoalOfTheSeasonVote(season: string, player: string): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postGoalOfTheSeasonVote.php?'

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('season', season)
      .append('player', player)
    })
  }

  public getPlayerOfTheSeason(): Observable<PlayerOfTheSeason[]> {
    return this.http.get<PlayerOfTheSeason[]>('https://www.hvtdpstainz.at/api/getPlayerOfTheSeason.php')
  }

  public postPlayerOfTheSeasonVote(season: string, player: string): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postPlayerOfTheSeasonVote.php?'

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('season', season)
      .append('player', player)
    })
  }
}
