import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { baseUrlImages } from '../shared/baseurls';
import { Router } from '@angular/router';
import { Image } from '../shared/image';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-imageslider',
  templateUrl: './imageslider.component.html',
  styleUrls: ['./imageslider.component.css'],
  animations: [
    trigger('slideAnimation', [
      // swipe right
      transition(':increment', [
        style({ opacity: 0, transform: 'translateX(24px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      // swipe left
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateX(-24px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class ImagesliderComponent implements OnInit {
  @ViewChildren('thumbBtn', { read: ElementRef })
  thumbButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  imageBaseUrl: String;
  currentIndex = 0;

  // Swipe state
  private startX = 0;
  currentTranslate = 0;
  cardTransition = 'none'; // CSS transition for smooth snap
  private isDragging = false;

  @Input() carouselItems: Image[] = [];
  @Input() showDots: Boolean = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.imageBaseUrl = baseUrlImages;
  }

  showImageDetails(item: Image) {
    console.log('navigate to ' + item.navPath);
    this.router.navigate([item.navPath]);
  }

  get currentImage(): Image | null {
    if (!this.carouselItems || this.carouselItems.length === 0) return null;
    return this.carouselItems[this.currentIndex];
  }

  imagePath(item: Image): string {
    return this.imageBaseUrl + item.imagePath;
  }

  previous() {
    if (!this.carouselItems.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.carouselItems.length) % this.carouselItems.length;
    this.scrollActiveThumbIntoView();
  }

  next() {
    if (!this.carouselItems.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
    this.scrollActiveThumbIntoView();
  }

  goTo(index: number) {
    if (index < 0 || index >= this.carouselItems.length) return;
    this.currentIndex = index;
    this.scrollActiveThumbIntoView();
  }

  trackByIndex(index: number) {
    return index;
  }

  toggleFullscreen(container: HTMLElement, event: MouseEvent): void {
    event.stopPropagation();

    const doc: any = document;
    const el: any = container;

    const isFullscreen =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (!isFullscreen) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }

  onTouchStart(event: TouchEvent) {
    if (!this.carouselItems.length) return;

    this.isDragging = true;
    this.cardTransition = 'none'; // no animation during drag
    this.startX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;

    const currentX = event.touches[0].clientX;
    const deltaX = currentX - this.startX;
    this.currentTranslate = deltaX;
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const threshold = 60;

    if (this.currentTranslate < -threshold) {
      this.next();
    } else if (this.currentTranslate > threshold) {
      this.previous();
    }

    this.cardTransition = 'transform 220ms ease-out';
    this.currentTranslate = 0;
  }

  onMouseDown(event: MouseEvent) {
    this.startDrag(event.clientX);
  }

  onMouseMove(event: MouseEvent) {
    this.moveDrag(event.clientX);
  }

  onMouseUp(event: MouseEvent) {
    this.endDrag();
  }

  onMouseLeave(event: MouseEvent) {
    if (this.isDragging) {
      this.endDrag();
    }
  }

  private scrollActiveThumbIntoView() {
    if (!this.thumbButtons || this.thumbButtons.length === 0) return;
    const btn = this.thumbButtons.get(this.currentIndex);
    if (!btn) return;

    btn.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  private startDrag(clientX: number) {
    if (!this.carouselItems.length) return;
    console.log('start drag');
    this.isDragging = true;
    this.cardTransition = 'none';
    this.startX = clientX;
  }

  private moveDrag(clientX: number) {
    if (!this.isDragging) return;
    console.log('move drag: ' + clientX);
    const deltaX = clientX - this.startX;
    this.currentTranslate = deltaX;
  }

  private endDrag() {
    if (!this.isDragging) return;
    console.log('end drag');
    this.isDragging = false;

    const threshold = 60;

    if (this.currentTranslate < -threshold) {
      this.next();
    } else if (this.currentTranslate > threshold) {
      this.previous();
    }

    this.endSwipe();
  }

  private endSwipe() {
    if (this.currentTranslate != 0) {
      this.cardTransition = 'transform 220ms ease-out';
      this.currentTranslate = 0;
    }
  }
}
