import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { baseUrlImages } from '../shared/baseurls';
import { Router } from '@angular/router';
import { Image } from '../shared/image';

@Component({
  selector: 'app-imageslider',
  templateUrl: './imageslider.component.html',
  styleUrls: ['./imageslider.component.css']
})
export class ImagesliderComponent implements OnInit {

  @ViewChildren('thumbBtn', { read: ElementRef })
  thumbButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  imageBaseUrl: String
  currentIndex = 0;

  @Input() carouselItems: Image[] = []

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.imageBaseUrl = baseUrlImages
  }

  ngAfterViewInit() {
    this.scrollActiveThumbIntoView();
  }

  showImageDetails(item) {
    console.log('navigate to ' + item.navPath)
    this.router.navigate([item.navPath]);
  }

  get currentImage(): Image | null {
    if (!this.carouselItems || this.carouselItems.length === 0) return null;
    return this.carouselItems[this.currentIndex];
  }

  imagePath(item: Image): string {
      return this.imageBaseUrl + item.imagePath
  }

  prev() {
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
}
