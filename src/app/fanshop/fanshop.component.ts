import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ShopService } from '../services/shop.service';
import { Item, OptionGroup } from '../shared/items';
import { CLUB_EMAIL } from '../shared/seasons';
import { ErrorUtil } from '../shared/utils/error.util';
import { formatPrice, priceLabel } from '../shared/utils/price.util';
import { ClampedTextComponent } from '../ui/clamped-text/clamped-text.component';
import { ContentSwapDirective } from '../ui/content-swap/content-swap.directive';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { ZoomableDirective } from '../ui/image-viewer/zoomable.directive';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { ScrollLockService } from '../ui/scroll-lock/scroll-lock.service';
import { SlidingIndicatorDirective } from '../ui/sliding-indicator/sliding-indicator.directive';
import { ToastService } from '../ui/toast/toast.service';

interface Order {
  item: Item;
  /** One value per option group of the item (chosen choice label or entered text), same order. */
  values: string[];
  quantity: number;
  note: string;
}

@Component({
  selector: 'app-fanshop',
  templateUrl: './fanshop.component.html',
  standalone: true,
  imports: [
    FormsModule,
    EmptyStateComponent,
    PageIntroComponent,
    ZoomableDirective,
    SlidingIndicatorDirective,
    ContentSwapDirective,
    ClampedTextComponent,
  ],
})
export class FanshopComponent implements OnInit, OnDestroy {
  private shopService = inject(ShopService);
  private titleService = inject(Title);
  private metaTagService = inject(Meta);
  private toastService = inject(ToastService);
  private scrollLock = inject(ScrollLockService);

  readonly email = CLUB_EMAIL;
  readonly priceLabel = priceLabel;
  readonly formatPrice = formatPrice;

  items: Item[] = [];
  categories: string[] = [];
  selectedCategory = 'Alle';
  loaded = false;
  failed = false;
  errorText = '';

  order: Order | null = null;
  @ViewChild('orderBackdrop') orderBackdrop?: ElementRef<HTMLElement>;
  private orderTrigger: HTMLElement | null = null;

  ngOnInit(): void {
    this.load();
    this.titleService.setTitle('HV TDP Stainz: Fanshop');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Handtücher, Fan-Shirts, Mützen & Co aus dem offizellen Fanshop des HV TDP Stainz.',
    });
  }

  ngOnDestroy() {
    // Leaving the page with the order sheet open (back button, header link) must not keep the lock.
    this.scrollLock.unlock(this);
  }

  load() {
    this.failed = false;
    this.shopService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.categories = ['Alle', ...new Set(this.items.map((item) => item.category))];
        this.loaded = true;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.failed = true;
        this.errorText = ErrorUtil.message(error);
      },
    });
  }

  get filteredItems(): Item[] {
    return this.selectedCategory === 'Alle'
      ? this.items
      : this.items.filter((item) => item.category === this.selectedCategory);
  }

  openOrder(item: Item) {
    this.orderTrigger =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // A required choice with only one possibility is preselected.
    const values = item.optionGroups.map((group) =>
      group.kind === 'choice' && group.required && group.choices.length === 1
        ? group.choices[0].label
        : ''
    );
    this.order = { item, values, quantity: 1, note: '' };
    this.scrollLock.lock(this);
    // Focus the sheet so Escape works right away.
    setTimeout(() => this.orderBackdrop?.nativeElement.focus());
  }

  closeOrder() {
    if (!this.order) {
      return;
    }
    this.order = null;
    this.scrollLock.unlock(this);
    this.orderTrigger?.focus();
    this.orderTrigger = null;
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeOrder();
    }
  }

  changeQuantity(delta: number) {
    if (this.order) {
      this.order.quantity = Math.max(1, Math.min(99, this.order.quantity + delta));
    }
  }

  choose(index: number, label: string) {
    if (this.order) {
      this.order.values[index] = label;
    }
  }

  /** Price of one piece: the price of a chosen priced option, otherwise the item price. */
  get unitPrice(): number | null {
    if (!this.order) {
      return null;
    }
    const { item, values } = this.order;
    const chosen = item.optionGroups
      .map(
        (group, index) =>
          group.choices.find((choice) => choice.label === values[index])?.price ?? null
      )
      .find((price) => price !== null);
    return chosen ?? item.price;
  }

  get totalPrice(): number | null {
    const unit = this.unitPrice;
    return unit === null || !this.order ? null : Math.round(unit * this.order.quantity * 100) / 100;
  }

  /** Labels of required options that are not filled yet. */
  get missingOptions(): string[] {
    if (!this.order) {
      return [];
    }
    const { item, values } = this.order;
    return item.optionGroups
      .filter((group: OptionGroup, index) => group.required && !values[index]?.trim())
      .map((group) => group.label);
  }

  get canSend(): boolean {
    return this.missingOptions.length === 0;
  }

  get subject(): string {
    return `Bestellung ${this.order?.item.name ?? ''}`;
  }

  /** Order email text (see design spec "Fanshop order email"). */
  get body(): string {
    if (!this.order) {
      return '';
    }
    const { item, values, quantity, note } = this.order;
    const options = item.optionGroups
      .map((group, index) => ({ label: group.label, value: values[index]?.trim() ?? '' }))
      .filter((option) => option.value)
      .map((option) => `${option.label}: ${option.value}`);
    const unit = this.unitPrice;
    const total = this.totalPrice;
    const priceLine =
      unit === null || total === null
        ? []
        : [
            quantity > 1
              ? `Preis: ${quantity} × ${formatPrice(unit)} = ${formatPrice(total)}`
              : `Preis: ${formatPrice(unit)}`,
          ];
    const lines = [
      'Hallo HV TDP Stainz,',
      'ich möchte folgenden Artikel bestellen:',
      '',
      `Artikel: ${item.name}`,
      ...options,
      `Anzahl: ${quantity}`,
      ...priceLine,
      ...(note.trim() ? [`Anmerkung: ${note.trim()}`] : []),
      '',
      'Danke & sportliche Grüße!',
    ];
    return lines.join('\n');
  }

  get mailUrl(): string {
    return `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }

  async copyOrder() {
    if (!this.canSend) {
      return;
    }
    try {
      await navigator.clipboard.writeText(`${this.subject}\n\n${this.body}`);
      this.toastService.show('Text kopiert');
    } catch {
      this.toastService.show('Kopieren nicht möglich', 'error');
    }
  }
}
