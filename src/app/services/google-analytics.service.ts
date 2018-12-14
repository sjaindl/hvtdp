import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GoogleAnalyticsService {

  constructor(private http: HttpClient) { }

  public getNumberOfSessions(): Observable<String> {
    return this.http.get<String>('https://www.hvtdpstainz.at/api/getAnalyticsData.php')
  }
}
