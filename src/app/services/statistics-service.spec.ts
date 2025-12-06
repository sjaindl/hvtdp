import { TestBed } from '@angular/core/testing';

import { StatisticsService } from './statistics.service';

describe('GoogleAnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatisticsService = TestBed.inject(StatisticsService);
    expect(service).toBeTruthy();
  });
});
