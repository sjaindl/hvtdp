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

  public postDuckrun(firstname: string, lastname: string, mail: string, phone: string, duckcount: number): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postDuckrun.php?'
    url += 'firstname=' + firstname
    url += '&lastname=' + lastname
    url += '&mail=' + mail
    url += '&phone=' + phone
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
      .append('duckcount',  ""+duckcount)
      .append('useragent', window.navigator.userAgent)
      .append('language', window.navigator.language)
      .append('platform', window.navigator.platform)
    })
  }

  public postHallenturnier(name: string, mail: string, phone: string, teamname: string, day: string): Observable<any> {
    var url = 'https://www.hvtdpstainz.at/api/postHallenturnier.php?'
    url += '&name=' + name
    url += '&mail=' + mail
    url += '&phone=' + phone
    url += '&teamname=' + teamname
    url += '&day=' + day
    url += '&useragent=' + window.navigator.userAgent
    url += '&language=' + window.navigator.language
    url += '&platform=' + window.navigator.platform

    return this.http.get<any>(url, {
      params: new HttpParams()
      .append('name', name)
      .append('mail', mail)
      .append('phone', phone)
      .append('teamname', teamname)
      .append('day', day)
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
}
