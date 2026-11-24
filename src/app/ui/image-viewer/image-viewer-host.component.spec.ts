import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTestDependencies } from '../../../testing/test-providers';
import { ImageViewerHostComponent } from './image-viewer-host.component';
import { ImageViewerService } from './image-viewer.service';

describe('ImageViewerHostComponent', () => {
  let fixture: ComponentFixture<ImageViewerHostComponent>;
  let viewer: ImageViewerService;
  const element = () => fixture.nativeElement as HTMLElement;
  const dialog = () => element().querySelector<HTMLElement>('[role=dialog]');
  const press = (key: string) => {
    dialog()?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageViewerHostComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(ImageViewerHostComponent);
    viewer = TestBed.inject(ImageViewerService);
    fixture.detectChanges();
  });

  afterEach(() => viewer.close());

  const openAlbum = (index = 0) => {
    viewer.open(
      [
        { src: 'a.jpg', alt: 'Foto A' },
        { src: 'b.jpg', alt: 'Foto B', caption: 'Siegerehrung' },
      ],
      index
    );
    fixture.detectChanges();
  };

  it('renders nothing while closed', () => {
    expect(dialog()).toBeNull();
  });

  it('shows the image with counter and navigation for a set of images', () => {
    openAlbum(1);
    expect(dialog()?.getAttribute('aria-label')).toBe('Foto B');
    expect(element().querySelector('img')?.getAttribute('src')).toBe('b.jpg');
    expect(element().textContent).toContain('2 / 2');
    expect(element().textContent).toContain('Siegerehrung');
    expect(element().querySelector('[aria-label="Nächstes Bild"]')).not.toBeNull();
  });

  it('shows a single image without counter and navigation', () => {
    viewer.open([{ src: 'a.jpg', alt: 'Foto A' }]);
    fixture.detectChanges();
    expect(element().textContent).not.toContain('1 / 1');
    expect(element().querySelector('[aria-label="Nächstes Bild"]')).toBeNull();
    expect(element().textContent).toContain('Foto A');
  });

  it('steps with the arrow keys and closes with Escape', () => {
    openAlbum();
    press('ArrowRight');
    expect(viewer.index()).toBe(1);
    press('ArrowLeft');
    expect(viewer.index()).toBe(0);
    press('Escape');
    expect(dialog()).toBeNull();
  });

  it('closes on a tap next to the image but not on the image itself', () => {
    openAlbum();
    element().querySelector<HTMLElement>('img')?.click();
    expect(viewer.current()).not.toBeNull();

    element().querySelector<HTMLElement>('[data-backdrop]')?.click();
    fixture.detectChanges();
    expect(dialog()).toBeNull();
  });

  it('closes with the close button', () => {
    openAlbum();
    element().querySelector<HTMLElement>('[aria-label="Schließen"]')?.click();
    fixture.detectChanges();
    expect(dialog()).toBeNull();
  });

  it('closes when navigating to another page', async () => {
    openAlbum();
    await TestBed.inject(Router).navigateByUrl('/');
    expect(viewer.current()).toBeNull();
  });
});
