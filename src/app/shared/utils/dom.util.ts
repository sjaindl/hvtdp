/**
 * Makes the browser apply pending style changes now (e.g. a start height before a transition, or removing an
 * animation class before adding it again). A method call is used on purpose: a bare `void el.offsetHeight`
 * looks side-effect free to the optimizer and is removed from production builds.
 */
export function forceReflow(element: Element): void {
  element.getBoundingClientRect();
}
