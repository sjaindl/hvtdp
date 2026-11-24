import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClampedTextComponent } from './clamped-text.component';

describe('ClampedTextComponent', () => {
  let fixture: ComponentFixture<ClampedTextComponent>;
  const element = () => fixture.nativeElement as HTMLElement;
  const paragraph = () => element().querySelector('p') as HTMLElement;
  const toggle = () => element().querySelector('button');
  const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const create = async (text: string) => {
    fixture = TestBed.createComponent(ClampedTextComponent);
    fixture.componentRef.setInput('text', text);
    fixture.componentRef.setInput('lines', 2);
    // A narrow, fixed width so the line count is predictable.
    element().style.width = '200px';
    document.body.appendChild(element());
    fixture.detectChanges();
    await nextFrame();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ClampedTextComponent] }).compileComponents();
  });

  afterEach(() => element().remove());

  it('shows short texts completely without a toggle', async () => {
    await create('Kurz.');
    expect(toggle()).toBeNull();
    expect(paragraph().textContent).toBe('Kurz.');
  });

  it('clamps long texts to the given number of lines', async () => {
    await create('Ein sehr langer Text, '.repeat(20));
    expect(paragraph().style.getPropertyValue('-webkit-line-clamp')).toBe('2');
    expect(paragraph().scrollHeight).toBeGreaterThan(paragraph().clientHeight);
    expect(toggle()?.textContent).toContain('Mehr anzeigen');
    expect(toggle()?.getAttribute('aria-expanded')).toBe('false');
  });

  it('animates the height when expanding and collapsing', async () => {
    await create('Ein sehr langer Text, '.repeat(20));
    const collapsed = paragraph().getBoundingClientRect().height;

    toggle()?.click();
    fixture.detectChanges();
    expect(toggle()?.textContent).toContain('Weniger anzeigen');
    expect(toggle()?.getAttribute('aria-expanded')).toBe('true');
    await wait(120);
    const midway = paragraph().getBoundingClientRect().height;
    expect(midway).toBeGreaterThan(collapsed);

    await wait(400);
    const expanded = paragraph().getBoundingClientRect().height;
    expect(expanded).toBeGreaterThan(midway);
    expect(paragraph().style.height).toBe('');
    expect(paragraph().scrollHeight).toBeLessThanOrEqual(paragraph().clientHeight + 1);

    toggle()?.click();
    fixture.detectChanges();
    expect(toggle()?.textContent).toContain('Mehr anzeigen');
    await wait(120);
    const shrinking = paragraph().getBoundingClientRect().height;
    expect(shrinking).toBeLessThan(expanded);
    expect(shrinking).toBeGreaterThan(collapsed);

    await wait(400);
    expect(paragraph().getBoundingClientRect().height).toBeCloseTo(collapsed, 0);
    expect(paragraph().style.getPropertyValue('-webkit-line-clamp')).toBe('2');
  });
});
