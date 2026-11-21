import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Item } from '../shared/items';
import { CLUB_EMAIL } from '../shared/seasons';
import { ErrorUtil } from '../shared/utils/error.util';
import { EmptyStateComponent } from '../ui/empty-state/empty-state.component';
import { PageIntroComponent } from '../ui/page-intro/page-intro.component';
import { ToastService } from '../ui/toast/toast.service';

interface Order {
  item: Item;
  /** TODO(API): sizes and variants are only part of the free-text description; offer them as structured options. */
  variant: string;
  quantity: number;
  note: string;
}

@Component({
  selector: 'app-fanshop',
  templateUrl: './fanshop.component.html',
  standalone: true,
  imports: [FormsModule, EmptyStateComponent, PageIntroComponent],
})
export class FanshopComponent implements OnInit {
  readonly imageBaseUrl = baseUrlImages;
  readonly email = CLUB_EMAIL;

  items: Item[] = [];
  categories: string[] = [];
  selectedCategory = 'Alle';
  loaded = false;
  failed = false;
  errorText = '';

  order: Order | null = null;

  constructor(
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
    this.titleService.setTitle('HV TDP Stainz: Fanshop');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Handtücher, Fan-Shirts, Mützen & Co aus dem offizellen Fanshop des HV TDP Stainz.',
    });
  }

  load() {
    this.failed = false;
    this.mysqlService.getItems().subscribe({
      next: (items) => {
        this.items = (items ?? []).map((item) => ({ ...item, category: item?.category || 'Sonstiges' }));
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
    this.order = { item, variant: '', quantity: 1, note: '' };
    document.body.classList.add('overflow-hidden');
  }

  closeOrder() {
    this.order = null;
    document.body.classList.remove('overflow-hidden');
  }

  changeQuantity(delta: number) {
    if (this.order) {
      this.order.quantity = Math.max(1, Math.min(99, this.order.quantity + delta));
    }
  }

  get subject(): string {
    return `Bestellung ${this.order?.item.name ?? ''}`;
  }

  /** Order email text (see design spec "Fanshop order email"). */
  get body(): string {
    if (!this.order) {
      return '';
    }
    const lines = [
      'Hallo HV TDP Stainz,',
      'ich möchte folgenden Artikel bestellen:',
      '',
      `Artikel: ${this.order.item.name}`,
      ...(this.order.variant.trim() ? [`Größe/Variante: ${this.order.variant.trim()}`] : []),
      `Anzahl: ${this.order.quantity}`,
      ...(this.order.note.trim() ? [`Anmerkung: ${this.order.note.trim()}`] : []),
      '',
      'Danke & sportliche Grüße!',
    ];
    return lines.join('\n');
  }

  get mailUrl(): string {
    return `mailto:${CLUB_EMAIL}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }

  async copyOrder() {
    try {
      await navigator.clipboard.writeText(`${this.subject}\n\n${this.body}`);
      this.toastService.show('Text kopiert');
    } catch {
      this.toastService.show('Kopieren nicht möglich', 'error');
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeOrder();
  }
}
