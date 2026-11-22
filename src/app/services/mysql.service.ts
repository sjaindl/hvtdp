import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GoldenShot } from '../shared/goldenshot';
import { Album } from '../shared/photos';
import { Survey } from '../shared/survey';

@Injectable()
export class MysqlService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://www.hvtdpstainz.at/api/';

  public getPhotos(): Observable<Album[]> {
    return this.http.get<Album[]>(this.baseUrl + 'getPhotos.php');
  }

  public getSurveyLink(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.baseUrl + 'getSurvey.php');
  }

  public postDuckrun(
    firstname: string,
    lastname: string,
    mail: string,
    phone: string,
    address: string,
    duckcount: number
  ): Observable<unknown> {
    let url = this.baseUrl + 'postDuckrun.php?';
    url += 'firstname=' + firstname;
    url += '&lastname=' + lastname;
    url += '&mail=' + mail;
    url += '&phone=' + phone;
    url += '&address=' + address;
    url += '&duckcount=' + duckcount;
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<unknown>(url, {
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
  ): Observable<unknown> {
    let url = this.baseUrl + 'postHallenturnier.php?';
    url += '&name=' + name;
    url += '&mail=' + mail;
    // url += '&phone=' + phone
    url += '&teamname=' + teamname;
    // url += '&day=' + day
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<unknown>(url, {
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
  ): Observable<unknown> {
    let url = this.baseUrl + 'postBigDarts.php?';
    url += '&name=' + name;
    url += '&mail=' + mail;
    // url += '&phone=' + phone
    url += '&teamname=' + teamname;
    // url += '&day=' + day
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<unknown>(url, {
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

  public postTurnier(name: string, mail: string, phone: string, teamname: string): Observable<unknown> {
    let url = this.baseUrl + 'postKleinfeldturnier.php?';
    url += '&name=' + name;
    url += '&mail=' + mail;
    url += '&phone=' + phone;
    url += '&teamname=' + teamname;
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<unknown>(url, {
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
  ): Observable<unknown> {
    let url = this.baseUrl + 'postGoldenShot.php?';
    url += '&firstName=' + firstName;
    url += '&lastName=' + lastName;
    url += '&mail=' + mail;
    url += '&phone=' + phone;
    url += '&photo=' + photo;
    url += '&useragent=' + window.navigator.userAgent;
    url += '&language=' + window.navigator.language;
    url += '&platform=' + window.navigator.platform;

    return this.http.get<unknown>(url, {
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

  public postGoldenShotVote(id: string): Observable<unknown> {
    const url = this.baseUrl + 'postGoldenShotVote.php?';

    return this.http.get<unknown>(url, {
      params: new HttpParams().append('id', id),
    });
  }
}
