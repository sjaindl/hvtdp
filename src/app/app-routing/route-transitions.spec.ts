import { ActivatedRouteSnapshot, Route, ViewTransitionInfo } from '@angular/router';
import {
  FROM_FULLSCREEN_MENU_CLASS,
  FROM_MENU_CLASS,
  isSamePage,
  leafRoute,
  onRouteViewTransition,
} from './route-transitions';

describe('route transitions', () => {
  const teamPage: Route = { path: 'team' };
  const seasonPage: Route = { path: 'championship/:season' };

  /** Root snapshot whose single child shows the given page. */
  const snapshot = (page: Route) => {
    const leaf = { routeConfig: page, firstChild: null } as unknown as ActivatedRouteSnapshot;
    return { routeConfig: null, firstChild: leaf } as unknown as ActivatedRouteSnapshot;
  };

  const transition = () => {
    let finish!: () => void;
    const finished = new Promise<void>((resolve) => (finish = resolve));
    return { skipTransition: jasmine.createSpy('skipTransition'), finished, finish };
  };

  const run = (from: Route, to: Route, viewTransition: ReturnType<typeof transition>) =>
    onRouteViewTransition({
      transition: viewTransition as unknown as ViewTransition,
      from: snapshot(from),
      to: snapshot(to),
    } as ViewTransitionInfo);

  afterEach(() => {
    document.documentElement.classList.remove(FROM_MENU_CLASS, FROM_FULLSCREEN_MENU_CLASS);
    document.querySelectorAll('[data-nav-menu]').forEach((menu) => menu.remove());
  });

  it('finds the page that is actually shown', () => {
    expect(leafRoute(snapshot(teamPage)).routeConfig).toBe(teamPage);
    expect(isSamePage(snapshot(seasonPage), snapshot(seasonPage))).toBeTrue();
    expect(isSamePage(snapshot(seasonPage), snapshot(teamPage))).toBeFalse();
  });

  it('skips the transition when only the season changes', () => {
    const viewTransition = transition();
    run(seasonPage, seasonPage, viewTransition);
    expect(viewTransition.skipTransition).toHaveBeenCalled();
  });

  it('plays the normal transition for another page', () => {
    const viewTransition = transition();
    run(seasonPage, teamPage, viewTransition);
    expect(viewTransition.skipTransition).not.toHaveBeenCalled();
    expect(document.documentElement.classList).not.toContain(FROM_MENU_CLASS);
  });

  it('lets an open menu animate out before the new page comes in', async () => {
    const menu = document.createElement('div');
    menu.setAttribute('data-nav-menu', '');
    document.body.appendChild(menu);

    const viewTransition = transition();
    run(seasonPage, teamPage, viewTransition);
    expect(document.documentElement.classList).toContain(FROM_MENU_CLASS);
    expect(document.documentElement.classList).not.toContain(FROM_FULLSCREEN_MENU_CLASS);

    viewTransition.finish();
    await viewTransition.finished;
    await Promise.resolve();
    expect(document.documentElement.classList).not.toContain(FROM_MENU_CLASS);
  });

  it('hides the old page behind a full-screen menu', () => {
    const menu = document.createElement('div');
    menu.setAttribute('data-nav-menu', 'fullscreen');
    document.body.appendChild(menu);

    run(seasonPage, teamPage, transition());
    expect(document.documentElement.classList).toContain(FROM_MENU_CLASS);
    expect(document.documentElement.classList).toContain(FROM_FULLSCREEN_MENU_CLASS);
  });
});
