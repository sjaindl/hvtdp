import { AnimationCallbackEvent, Component, ElementRef, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CLUB_NAV, HIGHLIGHTS_NAV, MAIN_NAV, NavItem, SOCIAL_LINKS } from '../shared/navigation';
import { STARTING_ELEVEN_URL } from '../shared/seasons';
import { ScrollLockService } from '../ui/scroll-lock/scroll-lock.service';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, SlidingIndicatorDirective],
})
export class HeaderComponent {
  private router = inject(Router);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private scrollLock = inject(ScrollLockService);

  readonly mainNav = MAIN_NAV;
  readonly highlightsNav = HIGHLIGHTS_NAV;
  readonly clubNav = CLUB_NAV;
  readonly socialLinks = SOCIAL_LINKS;
  readonly startingElevenUrl = STARTING_ELEVEN_URL;

  mobileMenuOpen = false;
  moreMenuOpen = false;
  currentUrl = '';
  /** Set when a navigation closes a menu: the route transition animates it out instead (see styles.css). */
  private closeWithoutAnimation = false;

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = (event as NavigationEnd).urlAfterRedirects;
        this.closeMenus(true);
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
    if (this.mobileMenuOpen) {
      this.scrollLock.lock(this);
    } else {
      this.scrollLock.unlock(this);
    }
  }

  closeMenus(forNavigation = false) {
    this.closeWithoutAnimation = forNavigation && (this.mobileMenuOpen || this.moreMenuOpen);
    this.mobileMenuOpen = false;
    this.moreMenuOpen = false;
    this.scrollLock.unlock(this);
  }

  /** Leave animation of the menus; skipped when a navigation closes them, so the new page has no menu. */
  onMenuLeave(event: AnimationCallbackEvent, leaveClass: string) {
    if (this.closeWithoutAnimation) {
      this.closeWithoutAnimation = false;
      event.animationComplete();
      return;
    }
    event.target.addEventListener('animationend', () => event.animationComplete(), { once: true });
    event.target.classList.add(leaveClass);
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
