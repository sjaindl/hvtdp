import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Survey } from '../shared/survey';

@Injectable()
export class MysqlService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'https://www.hvtdpstainz.at/api/';

  public getSurveyLink(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.baseUrl + 'getSurvey.php');
  }
}
