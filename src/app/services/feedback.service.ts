import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular) { }
  
  submitFeedback(feedback) : Observable<Feedback> {
    return this.restangular.all('feedback').post(feedback);
      //.subscribe(createdFeedback => { console.log(createdFeedback); });
  }
}
