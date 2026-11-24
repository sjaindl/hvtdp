import { TestBed } from '@angular/core/testing';
import { ImageViewerService, ViewerImage } from './image-viewer.service';

describe('ImageViewerService', () => {
  const images: ViewerImage[] = [
    { src: 'a.jpg', alt: 'A' },
    { src: 'b.jpg', alt: 'B' },
    { src: 'c.jpg', alt: 'C' },
  ];
  let service: ImageViewerService;

  beforeEach(() => {
    service = TestBed.inject(ImageViewerService);
  });

  afterEach(() => service.close());

  it('opens at the given image and locks page scrolling', () => {
    service.open(images, 1);
    expect(service.current()).toEqual(images[1]);
    expect(document.body.classList).toContain('overflow-hidden');
  });

  it('keeps the start index within the images', () => {
    service.open(images, 10);
    expect(service.index()).toBe(2);
    service.open(images, -3);
    expect(service.index()).toBe(0);
  });

  it('does nothing without images', () => {
    service.open([]);
    expect(service.current()).toBeNull();
    expect(document.body.classList).not.toContain('overflow-hidden');
  });

  it('steps through the images and wraps around at both ends', () => {
    service.open(images, 2);
    service.step(1);
    expect(service.current()?.src).toBe('a.jpg');
    service.step(-1);
    expect(service.current()?.src).toBe('c.jpg');
  });

  it('closes, unlocks scrolling and returns the focus to the element that opened it', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    service.open(images);
    (document.activeElement as HTMLElement | null)?.blur();
    service.close();

    expect(service.current()).toBeNull();
    expect(document.body.classList).not.toContain('overflow-hidden');
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});
