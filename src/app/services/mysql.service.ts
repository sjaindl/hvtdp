import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
import { PappFan } from '../shared/papp';


@Injectable()
export class MysqlService {

  constructor(private http: HttpClient) { }

  public getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>('https://www.hvtdpstainz.at/api/getPlayers.php')
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

  public getGames(): Observable<GameSeason[]> {
    return this.http.get<GameSeason[]>('https://www.hvtdpstainz.at/api/getGames.php')
  }

  public getPhotos(): Observable<AlbumSeason[]> {
    return this.http.get<AlbumSeason[]>('https://www.hvtdpstainz.at/api/getPhotos.php')
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
}
