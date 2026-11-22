import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewerService } from '../image-viewer/image-viewer.service';
import { FittedImageComponent } from './fitted-image.component';

describe('FittedImageComponent', () => {
  let fixture: ComponentFixture<FittedImageComponent>;
  const images = () => Array.from(fixture.nativeElement.querySelectorAll('img')) as HTMLImageElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FittedImageComponent] }).compileComponents();
    fixture = TestBed.createComponent(FittedImageComponent);
    fixture.componentRef.setInput('src', 'foto.jpg');
    fixture.componentRef.setInput('alt', 'Ballübergabe');
    fixture.detectChanges();
  });

  afterEach(() => TestBed.inject(ImageViewerService).close());

  it('shows the whole photo over a blurred, hidden copy of it', () => {
    const [backdrop, photo] = images();
    expect(backdrop.getAttribute('aria-hidden')).toBe('true');
    expect(backdrop.classList).toContain('blur-xl');
    expect(photo.getAttribute('src')).toBe('foto.jpg');
    expect(photo.alt).toBe('Ballübergabe');
    expect(photo.classList).toContain('object-contain');
  });

  it('opens the photo in the viewer by default', () => {
    images()[1].click();
    expect(TestBed.inject(ImageViewerService).current()?.alt).toBe('Ballübergabe');
  });

  it('can be used without zoom, e.g. inside a link', () => {
    fixture.componentRef.setInput('zoomable', false);
    fixture.detectChanges();
    images()[1].click();
    expect(TestBed.inject(ImageViewerService).current()).toBeNull();
  });

  it('shows the club logo when the photo cannot be loaded', () => {
    images()[1].dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(images().map((image) => image.getAttribute('src'))).toEqual(['hvtdp.png']);
  });
});
