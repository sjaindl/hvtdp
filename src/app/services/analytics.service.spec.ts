import { TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  const scripts = () =>
    Array.from(document.head.querySelectorAll('script')).filter((script) =>
      script.src.includes('googletagmanager.com')
    );
  const win = window as unknown as Record<string, unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
  });

  afterEach(() => {
    scripts().forEach((script) => script.remove());
    delete win['gtag'];
    delete win['dataLayer'];
    delete win['ga-disable-G-FNF110XEHW'];
  });

  it('requests nothing from Google until it is enabled', () => {
    TestBed.inject(AnalyticsService);
    expect(scripts().length).toBe(0);
    expect(win['gtag']).toBeUndefined();
  });

  it('loads gtag.js once on consent and sends a page view', () => {
    const service = TestBed.inject(AnalyticsService);
    service.enable();
    service.enable();
    expect(scripts().length).toBe(1);
    expect(scripts()[0].src).toContain('id=G-FNF110XEHW');
    const events = (win['dataLayer'] as IArguments[]).map((entry) => Array.from(entry));
    expect(
      events.some(([command, name]) => command === 'event' && name === 'page_view')
    ).toBeTrue();
  });

  it('stops tracking and removes the Analytics cookies when consent is withdrawn', () => {
    document.cookie = '_ga=GA1.1.123; path=/';
    TestBed.inject(AnalyticsService).disable();
    expect(win['ga-disable-G-FNF110XEHW']).toBeTrue();
    expect(document.cookie).not.toContain('_ga=');
  });
});
