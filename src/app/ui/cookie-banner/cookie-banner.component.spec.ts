import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { AnalyticsService } from '../../services/analytics.service';
import { provideTestDependencies } from '../../../testing/test-providers';
import { ImageViewerService } from '../image-viewer/image-viewer.service';
import { CookieBannerComponent } from './cookie-banner.component';
import { CookieConsentService } from './cookie-consent.service';

describe('CookieBannerComponent', () => {
  const CONSENT_COOKIE = 'cookieconsent_status';
  let fixture: ComponentFixture<CookieBannerComponent>;
  let cookies: jasmine.SpyObj<CookieService>;
  let analytics: jasmine.SpyObj<AnalyticsService>;
  const banner = () => (fixture.nativeElement as HTMLElement).querySelector('div.fixed');
  const button = (label: string) =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((b) =>
      b.textContent?.includes(label)
    );

  const create = (status: string) => {
    cookies.get.and.returnValue(status);
    fixture = TestBed.createComponent(CookieBannerComponent);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    cookies = jasmine.createSpyObj<CookieService>('CookieService', ['get', 'set']);
    analytics = jasmine.createSpyObj<AnalyticsService>('AnalyticsService', ['enable', 'disable']);
    await TestBed.configureTestingModule({
      imports: [CookieBannerComponent],
      providers: [
        ...provideTestDependencies(),
        { provide: CookieService, useValue: cookies },
        { provide: AnalyticsService, useValue: analytics },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(ImageViewerService).close();
  });

  it('asks for consent on the first visit and loads no Analytics before', () => {
    create('');
    expect(banner()).not.toBeNull();
    expect(analytics.enable).not.toHaveBeenCalled();
  });

  it('stays hidden once a choice was made and loads Analytics after an earlier consent', () => {
    create('allow');
    expect(banner()).toBeNull();
    expect(analytics.enable).toHaveBeenCalled();
  });

  it('stores the consent for a year and hides the banner', () => {
    create('');
    button('Alle akzeptieren')?.click();
    fixture.detectChanges();

    expect(cookies.set).toHaveBeenCalledWith(
      CONSENT_COOKIE,
      'allow',
      jasmine.objectContaining({ expires: 365, path: '/', sameSite: 'Lax' })
    );
    expect(banner()).toBeNull();
    expect(analytics.enable).toHaveBeenCalled();
  });

  it('keeps Google Analytics off when declined', () => {
    create('');
    button('Nur notwendige')?.click();
    expect(cookies.set).toHaveBeenCalledWith(CONSENT_COOKIE, 'deny', jasmine.any(Object));
    expect(analytics.enable).not.toHaveBeenCalled();
    expect(analytics.disable).toHaveBeenCalled();
  });

  it('keeps Google Analytics off on later visits after declining', () => {
    create('deny');
    expect(analytics.enable).not.toHaveBeenCalled();
    expect(analytics.disable).toHaveBeenCalled();
  });

  it('opens again from the cookie settings, so consent can be withdrawn', () => {
    create('allow');
    TestBed.inject(CookieConsentService).reopen();
    fixture.detectChanges();
    expect(banner()).not.toBeNull();

    button('Nur notwendige')?.click();
    fixture.detectChanges();
    expect(cookies.set).toHaveBeenCalledWith(CONSENT_COOKIE, 'deny', jasmine.any(Object));
    expect(analytics.disable).toHaveBeenCalled();
    expect(banner()).toBeNull();
  });

  it('hides while the image viewer is open', () => {
    create('');
    const viewer = TestBed.inject(ImageViewerService);
    viewer.open([{ src: 'a.jpg', alt: 'A' }]);
    fixture.detectChanges();
    expect(banner()).toBeNull();

    viewer.close();
    fixture.detectChanges();
    expect(banner()).not.toBeNull();
  });
});
