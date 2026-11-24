import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnouncementBarComponent } from './announcement-bar.component';

describe('AnnouncementBarComponent', () => {
  const DISMISSED_KEY = 'hvtdp-announcement-dismissed';
  const TEXT = '6. Runde STT Meisterschaft – Samstag, 31.10.2026 – 15:30 Uhr – Stadion Stainz';
  let fixture: ComponentFixture<AnnouncementBarComponent>;
  const element = () => fixture.nativeElement as HTMLElement;
  const bar = () => element().querySelector('aside');

  const create = (text: string) => {
    fixture = TestBed.createComponent(AnnouncementBarComponent);
    fixture.componentRef.setInput('text', text);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    localStorage.removeItem(DISMISSED_KEY);
    await TestBed.configureTestingModule({
      imports: [AnnouncementBarComponent],
    }).compileComponents();
  });

  afterEach(() => localStorage.removeItem(DISMISSED_KEY));

  it('shows the part before the first " – " bold and the rest as details', () => {
    create(TEXT);
    expect(element().querySelector('.font-bold')?.textContent?.trim()).toBe(
      '6. Runde STT Meisterschaft'
    );
    expect(element().querySelector('.font-medium')?.textContent?.trim()).toBe(
      'Samstag, 31.10.2026 – 15:30 Uhr – Stadion Stainz'
    );
  });

  it('shows texts without " – " as they are', () => {
    create('Training fällt heute aus');
    expect(element().querySelector('.font-bold')).toBeNull();
    expect(element().querySelector('.font-medium')?.textContent?.trim()).toBe(
      'Training fällt heute aus'
    );
  });

  it('renders nothing without a text', () => {
    create('   ');
    expect(bar()).toBeNull();
  });

  it('hides when closed and remembers it', () => {
    create(TEXT);
    element().querySelector<HTMLButtonElement>('[aria-label="Hinweis schließen"]')?.click();
    fixture.detectChanges();
    expect(bar()).toBeNull();
    expect(localStorage.getItem(DISMISSED_KEY)).toBe(TEXT);

    create(TEXT);
    expect(bar()).toBeNull();
  });

  it('shows again when the announcement changes', () => {
    localStorage.setItem(DISMISSED_KEY, TEXT);
    create('7. Runde STT Meisterschaft – Samstag, 07.11.2026');
    expect(bar()).not.toBeNull();
  });
});
