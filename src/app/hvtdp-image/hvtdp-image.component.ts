import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hvtdp-image',
  templateUrl: './hvtdp-image.component.html',
  styleUrls: ['./hvtdp-image.component.css'],
})
export class HvtdpImageComponent implements OnInit {
  @Input() imagePath: string;
  @Input() altText: string = '';

  constructor() {}

  ngOnInit(): void {}

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
}
