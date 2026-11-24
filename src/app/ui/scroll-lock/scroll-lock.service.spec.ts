import { TestBed } from '@angular/core/testing';
import { ScrollLockService } from './scroll-lock.service';

describe('ScrollLockService', () => {
  let service: ScrollLockService;
  const sheet = {};
  const viewer = {};

  beforeEach(() => {
    service = TestBed.inject(ScrollLockService);
  });

  afterEach(() => {
    service.unlock(sheet);
    service.unlock(viewer);
  });

  it('locks page scrolling until the owner unlocks it', () => {
    service.lock(sheet);
    expect(document.body.classList).toContain('overflow-hidden');
    service.unlock(sheet);
    expect(document.body.classList).not.toContain('overflow-hidden');
  });

  it('keeps the page locked while another overlay is still open', () => {
    service.lock(sheet);
    service.lock(viewer);
    service.unlock(viewer);
    expect(document.body.classList).toContain('overflow-hidden');
    service.unlock(sheet);
    expect(document.body.classList).not.toContain('overflow-hidden');
  });

  it('counts repeated locks of the same owner once', () => {
    service.lock(sheet);
    service.lock(sheet);
    service.unlock(sheet);
    expect(document.body.classList).not.toContain('overflow-hidden');
  });
});
