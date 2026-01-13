import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chef } from '../shared/chefs';
import { HvtdpDocument } from '../shared/document';
import { Donation } from '../shared/donations';
import { Game } from '../shared/games';
import { GoalOfTheSeason } from '../shared/goaloftheseason';
import { GoldenShot } from '../shared/goldenshot';
import { Item } from '../shared/items';
import { MatchInfo } from '../shared/match-info';
import { Member } from '../shared/member';
import { News } from '../shared/news';
import { PappFan } from '../shared/papp';
import { Album } from '../shared/photos';
import { Player } from '../shared/player';
import { PlayerOfTheSeason } from '../shared/playeroftheseason';
import { Scorer } from '../shared/scorer';
import { Standing } from '../shared/standing';
import { Survey } from '../shared/survey';
import { Ticker } from '../shared/ticker';
import { Validation } from '../shared/validation';

@Injectable()
export class MysqlService {
  private readonly baseUrl = 'https://www.hvtdpstainz.at/api/';

  constructor(private http: HttpClient) {}

  public getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.baseUrl + 'getPlayers.php');
  }

  public getSquadPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.baseUrl + 'getSquadPlayers.php');
  }

  public getActivePlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.baseUrl + 'getActivePlayers.php');
  }

  public getChefs(): Observable<Chef[]> {
    return this.http.get<Chef[]>(this.baseUrl + 'getChefs.php');
  }

  public getDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(this.baseUrl + 'getDonations.php');
  }

  public getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl + 'getItems.php');
  }

  public getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.baseUrl + 'getNews.php');
  }

  public getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.baseUrl + 'getGames.php');
  }

  public getPhotos(): Observable<Album[]> {
    return this.http.get<Album[]>(this.baseUrl + 'getPhotos.php');
  }

  public getDocuments(): Observable<HvtdpDocument[]> {
    return this.http.get<HvtdpDocument[]>(this.baseUrl + 'getDocuments.php');
  }

  public getTickerItems(): Observable<Ticker[]> {
    return this.http.get<Ticker[]>(this.baseUrl + 'getTicker.php');
  }

  public getSurveyLink(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.baseUrl + 'getSurvey.php');
  }

  public getPappfans(): Observable<PappFan[]> {
    return this.http.get<PappFan[]>(this.baseUrl + 'getPappfans.php');
  }

  public getActiveMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + 'getActiveMembership.php');
  }

  public getSupportMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl + 'getSupportMembership.php');
  }

  public getStandings(): Observable<Standing[]> {
    return this.http.get<Standing[]>(this.baseUrl + 'getStandings.php');
  }

  public getScorers(): Observable<Scorer[]> {
    return this.http.get<Scorer[]>(this.baseUrl + 'getScorers.php');
  }

  public getMatchInfo(): Observable<MatchInfo[]> {
    return this.http.get<MatchInfo[]>(this.baseUrl + 'getMatchInfo.php');
  }

  public checkPassword(password: string): Observable<Validation[]> {
    return this.http.get<Validation[]>(this.baseUrl + 'checkPasswordValid.php', {
      params: new HttpParams().set('password', password),
    });
  }

  public postDuckrun(
    firstname: string,
    lastname: string,
    mail: string,
    phone: string,
    address: string,
    duckcount: number
  ): Observable<any> {
    var url = this.baseUrl + 'postDuckrun.php?';
    url += 'firstname=' + firstname;
    url += '&lastname=' + lastname;
    url += '&mail=' + mail;
    url += '&phone=' + phone;
    url += '&address=' + address;
    url += '&duckcount=' + duckcount;
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<any>(url, {
      params: new HttpParams()
        .append('firstname', firstname)
        .append('lastname', lastname)
        .append('mail', mail)
        .append('phone', phone)
        .append('address', address)
        .append('duckcount', '' + duckcount)
        .append('useragent', window.navigator.userAgent)
        .append('language', window.navigator.language)
        .append('platform', window.navigator.platform),
    });
  }

  public postHallenturnier(
    name: string,
    mail: string,
    // phone: string,
    teamname: string
    // day: string
  ): Observable<any> {
    var url = this.baseUrl + 'postHallenturnier.php?';
    url += '&name=' + name;
    url += '&mail=' + mail;
    // url += '&phone=' + phone
    url += '&teamname=' + teamname;
    // url += '&day=' + day
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<any>(url, {
      params: new HttpParams()
        .append('name', name)
        .append('mail', mail)
        // .append('phone', phone)
        .append('teamname', teamname)
        // .append('day', day)
        .append('useragent', window.navigator.userAgent)
        .append('language', window.navigator.language)
        .append('platform', window.navigator.platform),
    });
  }

  public postBigdarts(
    name: string,
    mail: string,
    // phone: string,
    teamname: string
    // day: string
  ): Observable<any> {
    var url = this.baseUrl + 'postBigDarts.php?';
    url += '&name=' + name;
    url += '&mail=' + mail;
    // url += '&phone=' + phone
    url += '&teamname=' + teamname;
    // url += '&day=' + day
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<any>(url, {
      params: new HttpParams()
        .append('name', name)
        .append('mail', mail)
        // .append('phone', phone)
        .append('teamname', teamname)
        // .append('day', day)
        .append('useragent', window.navigator.userAgent)
        .append('language', window.navigator.language)
        .append('platform', window.navigator.platform),
    });
  }

  public postTurnier(name: string, mail: string, phone: string, teamname: string): Observable<any> {
    var url = this.baseUrl + 'postKleinfeldturnier.php?';
    url += '&name=' + name;
    url += '&mail=' + mail;
    url += '&phone=' + phone;
    url += '&teamname=' + teamname;
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<any>(url, {
      params: new HttpParams()
        .append('name', name)
        .append('mail', mail)
        .append('phone', phone)
        .append('teamname', teamname)
        .append('useragent', window.navigator.userAgent)
        .append('language', window.navigator.language)
        .append('platform', window.navigator.platform),
    });
  }

  public getGoldenshot(): Observable<GoldenShot[]> {
    return this.http.get<GoldenShot[]>(this.baseUrl + 'getGoldenShot.php');
  }

  public postGoldenShotRegistration(
    firstName: string,
    lastName: string,
    mail: string,
    phone: string,
    photo: string
  ): Observable<any> {
    var url = this.baseUrl + 'postGoldenShot.php?';
    url += '&firstName=' + firstName;
    url += '&lastName=' + lastName;
    url += '&mail=' + mail;
    url += '&phone=' + phone;
    url += '&photo=' + photo;
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<any>(url, {
      params: new HttpParams()
        .append('firstName', firstName)
        .append('lastName', lastName)
        .append('mail', mail)
        .append('phone', phone)
        .append('photo', photo)
        .append('useragent', window.navigator.userAgent)
        .append('language', window.navigator.language)
        .append('platform', window.navigator.platform),
    });
  }

  public postGoldenShotVote(id: string): Observable<any> {
    var url = this.baseUrl + 'postGoldenShotVote.php?';

    return this.http.get<any>(url, {
      params: new HttpParams().append('id', id),
    });
  }

  public getGoalOfTheSeason(): Observable<GoalOfTheSeason[]> {
    return this.http.get<GoalOfTheSeason[]>(this.baseUrl + 'getGoalOfTheSeason.php');
  }

  public postGoalOfTheSeasonVote(season: string, player: string): Observable<any> {
    var url = this.baseUrl + 'postGoalOfTheSeasonVote.php?';

    return this.http.get<any>(url, {
      params: new HttpParams().append('season', season).append('player', player),
    });
  }

  public getPlayerOfTheSeason(): Observable<PlayerOfTheSeason[]> {
    return this.http.get<PlayerOfTheSeason[]>(this.baseUrl + 'getPlayerOfTheSeason.php');
  }

  public postPlayerOfTheSeasonVote(season: string, player: string): Observable<any> {
    var url = this.baseUrl + 'postPlayerOfTheSeasonVote.php?';

    return this.http.get<any>(url, {
      params: new HttpParams().append('season', season).append('player', player),
    });
  }
}
