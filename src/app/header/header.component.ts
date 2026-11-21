import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CLUB_NAV, HIGHLIGHTS_NAV, MAIN_NAV, NavItem, SOCIAL_LINKS } from '../shared/navigation';
import { STARTING_ELEVEN_URL } from '../shared/seasons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class HeaderComponent {
  private router = inject(Router);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly mainNav = MAIN_NAV;
  readonly highlightsNav = HIGHLIGHTS_NAV;
  readonly clubNav = CLUB_NAV;
  readonly socialLinks = SOCIAL_LINKS;
  readonly startingElevenUrl = STARTING_ELEVEN_URL;

  mobileMenuOpen = false;
  moreMenuOpen = false;
  currentUrl = '';

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = (event as NavigationEnd).urlAfterRedirects;
        this.closeMenus();
      });
  }

  isActive(item: NavItem): boolean {
    return this.currentUrl === item.match || this.currentUrl.startsWith(item.match + '/');
  }

  get moreActive(): boolean {
    return [...this.highlightsNav, ...this.clubNav].some((item) => this.isActive(item));
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.classList.toggle('overflow-hidden', this.mobileMenuOpen);
  }

  closeMenus() {
    this.mobileMenuOpen = false;
    this.moreMenuOpen = false;
    document.body.classList.remove('overflow-hidden');
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.moreMenuOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.moreMenuOpen = false;
    }
  }
}
