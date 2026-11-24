import { TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { MysqlService } from './mysql.service';

describe('MysqlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTestDependencies(), MysqlService],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(MysqlService)).toBeTruthy();
  });
});
