import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { provideTestDependencies } from '../../../testing/test-providers';
import { ImageViewerService } from '../image-viewer/image-viewer.service';
import { CookieBannerComponent } from './cookie-banner.component';

describe('CookieBannerComponent', () => {
  const CONSENT_COOKIE = 'cookieconsent_status';
  let fixture: ComponentFixture<CookieBannerComponent>;
  let cookies: jasmine.SpyObj<CookieService>;
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
    await TestBed.configureTestingModule({
      imports: [CookieBannerComponent],
      providers: [...provideTestDependencies(), { provide: CookieService, useValue: cookies }],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(ImageViewerService).close();
    const flags = window as unknown as Record<string, boolean>;
    delete flags['ga-disable-UA-122732749-1'];
    delete flags['ga-disable-G-FNF110XEHW'];
  });

  it('asks for consent on the first visit', () => {
    create('');
    expect(banner()).not.toBeNull();
  });

  it('stays hidden once a choice was made', () => {
    create('allow');
    expect(banner()).toBeNull();
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
  });

  it('switches off Google Analytics when declined', () => {
    create('');
    button('Nur notwendige')?.click();
    expect(cookies.set).toHaveBeenCalledWith(CONSENT_COOKIE, 'deny', jasmine.any(Object));
    expect((window as unknown as Record<string, boolean>)['ga-disable-G-FNF110XEHW']).toBeTrue();
  });

  it('keeps Google Analytics switched off on later visits after declining', () => {
    create('deny');
    expect((window as unknown as Record<string, boolean>)['ga-disable-UA-122732749-1']).toBeTrue();
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
