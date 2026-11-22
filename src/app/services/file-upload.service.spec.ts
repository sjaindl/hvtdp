import { TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTestDependencies(), FileUploadService],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(FileUploadService)).toBeTruthy();
  });
});
