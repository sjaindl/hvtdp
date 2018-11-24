import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import { Player } from '../shared/player';
import { Chef } from '../shared/chefs';
import { Donation } from '../shared/donations';
import { Item } from '../shared/items';
import { News } from '../shared/news';
import { GameSeason } from '../shared/games';
import { AlbumSeason } from '../shared/photos';
import { HvtdpDocument } from '../shared/document';
import { Ticker } from '../shared/ticker';
import { Survey } from '../shared/survey';

@Injectable()
export class MysqlService {

  constructor(private http: Http) { }

  public getPlayers(): Observable<Player[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getPlayers.php')
      .do(response => console.log(response))
      .map(response => response.json());
  }

  public getChefs(): Observable<Chef[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getChefs.php')
      .do(response => console.log(response))
      .map(response => response.json())
  }

  public getDonations(): Observable<Donation[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getDonations.php')
      .do(response => console.log(response))  
      .map(response => response.json())
  }

  public getItems(): Observable<Item[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getItems.php')
      .do(response => console.log(response))  
      .map(response => response.json())
  }

  public getNews(): Observable<News[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getNews.php')
      .do(response => console.log(response))
      .map(response => response.json())
  }

  public getGames(): Observable<GameSeason[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getGames.php')
      .do(response => console.log(response))
      .map(response => response.json())
  }

  public getPhotos(): Observable<AlbumSeason[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getPhotos.php')
      .do(response => console.log(response))
      .map(response => response.json())
  }

  public getDocuments(): Observable<HvtdpDocument[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getDocuments.php')
      .do(response => console.log(response))
      .map(response => response.json())
  }

  public getTickerItems(): Observable<Ticker[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getTicker.php')
      .do(response => console.log(response))
      .map(response => response.json())
  }

  public getSurveyLink(): Observable<Survey[]> {
    return this.http.get('https://www.hvtdpstainz.at/api/getSurvey.php')
      .do(response => console.log(response))
      .map(response => response.json())
  }
}
