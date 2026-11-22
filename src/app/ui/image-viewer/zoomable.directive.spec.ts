import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewerService, ViewerImage } from './image-viewer.service';
import { ZoomableDirective } from './zoomable.directive';

@Component({
  standalone: true,
  imports: [ZoomableDirective],
  template: `
    <img id="single" src="assets/images/hvtdp.png" alt="Vereinslogo" appZoomable zoomCaption="Logo" />
    <img id="group" src="b.jpg" alt="B" appZoomable [zoomGroup]="album" [zoomIndex]="1" />
    <img id="off" src="c.jpg" alt="C" [appZoomable]="false" />
  `,
})
class HostComponent {
  album: ViewerImage[] = [
    { src: 'a.jpg', alt: 'A' },
    { src: 'b.jpg', alt: 'B' },
  ];
}

describe('ZoomableDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let viewer: ImageViewerService;
  const image = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLImageElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    viewer = TestBed.inject(ImageViewerService);
    fixture.detectChanges();
  });

  afterEach(() => viewer.close());

  it('makes the image a keyboard-accessible button', () => {
    const single = image('single');
    expect(single.getAttribute('role')).toBe('button');
    expect(single.getAttribute('tabindex')).toBe('0');
    expect(single.getAttribute('aria-label')).toBe('Vereinslogo vergrößern');
    expect(single.classList).toContain('cursor-zoom-in');
  });

  it('opens the image in the viewer on click', () => {
    image('single').click();
    expect(viewer.images().length).toBe(1);
    expect(viewer.current()?.src).toContain('assets/images/hvtdp.png');
    expect(viewer.current()?.alt).toBe('Vereinslogo');
    expect(viewer.current()?.caption).toBe('Logo');
  });

  it('opens with Enter and Space', () => {
    image('single').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(viewer.current()).not.toBeNull();
    viewer.close();

    image('single').dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(viewer.current()).not.toBeNull();
  });

  it('opens the whole group at the given index', () => {
    image('group').click();
    expect(viewer.images().length).toBe(2);
    expect(viewer.current()?.src).toBe('b.jpg');
  });

  it('does nothing when switched off', () => {
    const off = image('off');
    off.click();
    fixture.detectChanges();
    expect(viewer.current()).toBeNull();
    expect(off.getAttribute('role')).toBeNull();
    expect(off.getAttribute('tabindex')).toBeNull();
    expect(off.classList).not.toContain('cursor-zoom-in');
  });

  it('stops working for images that failed to load', () => {
    const single = image('single');
    single.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    single.click();
    expect(viewer.current()).toBeNull();
    expect(single.getAttribute('role')).toBeNull();
  });
});
