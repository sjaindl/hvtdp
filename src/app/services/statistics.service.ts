import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StatisticsService {
  private http = inject(HttpClient);

  public getNumberOfSessions(): Observable<string> {
    return this.http.get<string>('https://www.hvtdpstainz.at/api/getAnalyticsData.php');
  }

  public getVisitorCount(): Observable<string> {
    return this.http.get<string>('https://www.hvtdpstainz.at/api/getVisitCount.php');
  }
}
