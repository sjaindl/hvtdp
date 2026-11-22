import { TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { StatisticsService } from './statistics.service';

describe('StatisticsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTestDependencies(), StatisticsService],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(StatisticsService)).toBeTruthy();
  });
});
