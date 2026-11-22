import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlidingIndicatorDirective } from './sliding-indicator.directive';

@Component({
  standalone: true,
  imports: [SlidingIndicatorDirective],
  template: `
    <div id="chips" class="flex gap-2" appSlidingIndicator>
      @for (item of items; track item) {
        <button type="button" [class]="item === selected() ? 'chip-active' : 'chip'" [style.width.px]="item.length * 30">
          {{ item }}
        </button>
      }
    </div>
    <nav id="nav" class="flex h-20" appSlidingIndicator="underline" activeSelector="[aria-current='page']">
      <a [attr.aria-current]="page() === 'home' ? 'page' : null" style="width: 80px">Home</a>
      <a [attr.aria-current]="page() === 'team' ? 'page' : null" style="width: 60px">Team</a>
    </nav>
  `,
})
class HostComponent {
  items = ['2026', '2025-2026', '2024'];
  selected = signal<string | null>('2026');
  page = signal<string | null>('home');
}

describe('SlidingIndicatorDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  const group = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const indicator = (id: string) => group(id).querySelector('.sliding-indicator') as HTMLElement;
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => fixture.nativeElement.remove());

  it('adds one hidden-from-screen-readers indicator as first child', () => {
    expect(group('chips').firstElementChild).toBe(indicator('chips'));
    expect(indicator('chips').getAttribute('aria-hidden')).toBe('true');
    expect(group('chips').dataset['indicator']).toBe('pill');
  });

  it('places the pill exactly behind the active chip', () => {
    const active = group('chips').querySelector('.chip-active') as HTMLElement;
    expect(indicator('chips').style.width).toBe(`${active.offsetWidth}px`);
    expect(indicator('chips').style.height).toBe(`${active.offsetHeight}px`);
    expect(indicator('chips').style.transform).toBe(`translate(${active.offsetLeft}px, ${active.offsetTop}px)`);
    expect(indicator('chips').style.opacity).toBe('1');
  });

  it('moves to the new active chip', async () => {
    fixture.componentInstance.selected.set('2025-2026');
    fixture.detectChanges();
    await nextFrame();

    const active = group('chips').querySelector('.chip-active') as HTMLElement;
    expect(active.textContent?.trim()).toBe('2025-2026');
    expect(indicator('chips').style.width).toBe(`${active.offsetWidth}px`);
    expect(indicator('chips').style.transform).toContain(`translate(${active.offsetLeft}px`);
  });

  it('hides when nothing is active', async () => {
    fixture.componentInstance.selected.set(null);
    fixture.detectChanges();
    await nextFrame();
    expect(indicator('chips').style.opacity).toBe('0');
  });

  it('draws a 2px underline at the bottom of the active link', async () => {
    const home = group('nav').querySelector('[aria-current]') as HTMLElement;
    expect(indicator('nav').style.height).toBe('2px');
    expect(indicator('nav').style.transform).toBe(
      `translate(${home.offsetLeft}px, ${home.offsetTop + home.offsetHeight - 2}px)`
    );

    fixture.componentInstance.page.set('team');
    fixture.detectChanges();
    await nextFrame();
    const team = group('nav').querySelector('[aria-current]') as HTMLElement;
    expect(indicator('nav').style.width).toBe(`${team.offsetWidth}px`);
  });
});
