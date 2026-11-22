import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentSwapDirective } from './content-swap.directive';

@Component({
  standalone: true,
  imports: [ContentSwapDirective],
  template: `<section [appContentSwap]="season()" [busy]="loading()">Inhalt</section>`,
})
class HostComponent {
  season = signal('2026');
  loading = signal(false);
}

describe('ContentSwapDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  const section = () => fixture.nativeElement.querySelector('section') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('does not animate on the first render', () => {
    expect(section().classList).not.toContain('animate-content-in');
  });

  it('dims the content while busy', () => {
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(section().classList).toContain('opacity-50');
    expect(section().getAttribute('aria-busy')).toBe('true');

    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();
    expect(section().classList).not.toContain('opacity-50');
    expect(section().getAttribute('aria-busy')).toBeNull();
  });

  it('plays the entrance animation when the key changes', () => {
    fixture.componentInstance.season.set('2025');
    fixture.detectChanges();
    expect(section().classList).toContain('animate-content-in');
  });
});
