import { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';

/** The deepest active route, i.e. the one that decides which page is shown. */
export function leafRoute(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let route = snapshot;
  while (route.firstChild) {
    route = route.firstChild;
  }
  return route;
}

/** True when a navigation only changes parameters of the same page (e.g. another season). */
export function isSamePage(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot): boolean {
  return leafRoute(from).routeConfig === leafRoute(to).routeConfig;
}

/** Marks a transition that starts from an open header menu, see `html.vt-from-menu` in styles.css. */
export const FROM_MENU_CLASS = 'vt-from-menu';
/** Added as well when that menu covers the whole page (mobile), so the old page is not shown through it. */
export const FROM_FULLSCREEN_MENU_CLASS = 'vt-from-fullscreen-menu';

/**
 * Route transitions use the View Transitions API (styles in styles.css). Season switches on the same page
 * animate their content instead, and visitors who prefer reduced motion get no transition.
 * When the navigation comes from an open menu, the menu animates out first and the new page follows.
 */
export function onRouteViewTransition({ transition, from, to }: ViewTransitionInfo): void {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || isSamePage(from, to)) {
    transition.skipTransition();
    return;
  }
  const menu = document.querySelector('[data-nav-menu]');
  if (menu) {
    const classes = [
      FROM_MENU_CLASS,
      ...(menu.getAttribute('data-nav-menu') === 'fullscreen' ? [FROM_FULLSCREEN_MENU_CLASS] : []),
    ];
    const root = document.documentElement;
    root.classList.add(...classes);
    transition.finished.finally(() => root.classList.remove(...classes));
  }
}
