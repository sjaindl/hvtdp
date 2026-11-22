import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { Item } from '../shared/items';
import { FanshopComponent } from './fanshop.component';

describe('FanshopComponent', () => {
  let component: FanshopComponent;
  let fixture: ComponentFixture<FanshopComponent>;

  const cap: Item = {
    name: 'Kapperl',
    description: '',
    category: 'Accessoires',
    imageUrl: null,
    imageLargeUrl: null,
    price: 21,
    priceNote: '',
    optionGroups: [
      {
        label: 'Ausführung',
        kind: 'choice',
        required: true,
        placeholder: '',
        choices: [
          { label: 'Ohne Logo', price: 21 },
          { label: 'Mit Logo', price: 25 },
        ],
      },
      {
        label: 'Größe',
        kind: 'choice',
        required: true,
        placeholder: '',
        choices: [
          { label: 'S/M', price: null },
          { label: 'L/XL', price: null },
        ],
      },
      { label: 'Initialen', kind: 'text', required: false, placeholder: '', choices: [] },
    ],
  };
  const voucher: Item = {
    ...cap,
    name: 'Gutschein',
    price: null,
    priceNote: 'Betrag frei wählbar',
    optionGroups: [
      { label: 'Betrag', kind: 'text', required: true, placeholder: 'z. B. 30 €', choices: [] },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FanshopComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(FanshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => component.closeOrder());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('asks for required options before the order can be sent', () => {
    component.openOrder(cap);
    expect(component.missingOptions).toEqual(['Ausführung', 'Größe']);
    expect(component.canSend).toBeFalse();

    component.choose(0, 'Mit Logo');
    component.choose(1, 'L/XL');
    expect(component.missingOptions).toEqual([]);
    expect(component.canSend).toBeTrue();
  });

  it('uses the price of the chosen option and multiplies it by the quantity', () => {
    component.openOrder(cap);
    expect(component.unitPrice).toBe(21);
    component.choose(0, 'Mit Logo');
    component.changeQuantity(1);
    expect(component.unitPrice).toBe(25);
    expect(component.totalPrice).toBe(50);
  });

  it('lists the chosen options and the price in the order email', () => {
    component.openOrder(cap);
    component.choose(0, 'Mit Logo');
    component.choose(1, 'L/XL');
    component.changeQuantity(1);
    expect(component.subject).toBe('Bestellung Kapperl');
    expect(component.body).toContain(
      'Artikel: Kapperl\nAusführung: Mit Logo\nGröße: L/XL\nAnzahl: 2\nPreis: 2 × 25,00 € = 50,00 €'
    );
    expect(component.body).not.toContain('Initialen');
    expect(component.mailUrl).toContain(encodeURIComponent('Größe: L/XL'));
  });

  it('takes the voucher amount from the text field and shows no fixed price', () => {
    component.openOrder(voucher);
    expect(component.canSend).toBeFalse();
    component.order!.values[0] = '30 €';
    expect(component.canSend).toBeTrue();
    expect(component.unitPrice).toBeNull();
    expect(component.body).toContain('Betrag: 30 €');
    expect(component.body).not.toContain('Preis:');
  });

  it('preselects a required choice with only one possibility', () => {
    component.openOrder({
      ...cap,
      optionGroups: [
        {
          label: 'Größe',
          kind: 'choice',
          required: true,
          placeholder: '',
          choices: [{ label: 'Einheitsgröße', price: null }],
        },
      ],
    });
    expect(component.order?.values).toEqual(['Einheitsgröße']);
    expect(component.canSend).toBeTrue();
  });
});
