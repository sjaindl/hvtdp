import { TestBed, inject } from '@angular/core/testing';

import { MysqlService } from './mysql.service';

describe('MysqlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MysqlService]
    });
  });

  it('should be created', inject([MysqlService], (service: MysqlService) => {
    expect(service).toBeTruthy();
  }));
});
