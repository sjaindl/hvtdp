import { Item } from '../items';
import { formatPrice, priceLabel } from './price.util';

describe('price util', () => {
  const item = (overrides: Partial<Item>): Item => ({
    name: 'Artikel',
    description: '',
    category: 'Sonstiges',
    imageUrl: null,
    imageLargeUrl: null,
    price: null,
    priceNote: '',
    optionGroups: [],
    ...overrides,
  });

  it('formats euro amounts the Austrian way', () => {
    expect(formatPrice(14.9)).toBe('14,90 €');
    expect(formatPrice(5)).toBe('5,00 €');
    expect(formatPrice(1234.5)).toBe('1.234,50 €');
  });

  it('shows the price of an item without options', () => {
    expect(priceLabel(item({ price: 14.9 }))).toBe('14,90 €');
  });

  it('shows the cheapest option price when options change the price', () => {
    const towel = item({
      price: 12.9,
      optionGroups: [
        {
          label: 'Größe',
          kind: 'choice',
          required: true,
          placeholder: '',
          choices: [
            { label: 'Klein', price: 12.9 },
            { label: 'Groß', price: 17.9 },
          ],
        },
      ],
    });
    expect(priceLabel(towel)).toBe('ab 12,90 €');
  });

  it('ignores options without a price', () => {
    const socks = item({
      price: 9.9,
      optionGroups: [
        {
          label: 'Größe',
          kind: 'choice',
          required: true,
          placeholder: '',
          choices: [{ label: '36–41', price: null }],
        },
      ],
    });
    expect(priceLabel(socks)).toBe('9,90 €');
  });

  it('counts the item price for choices without a price', () => {
    const shirt = item({
      price: 20,
      optionGroups: [
        {
          label: 'Größe',
          kind: 'choice',
          required: true,
          placeholder: '',
          choices: [
            { label: 'M', price: null },
            { label: 'XXL', price: 22 },
          ],
        },
      ],
    });
    expect(priceLabel(shirt)).toBe('ab 20,00 €');
  });

  it('shows the price note (or a fallback) without any price', () => {
    expect(priceLabel(item({ priceNote: 'Betrag frei wählbar' }))).toBe('Betrag frei wählbar');
    expect(priceLabel(item({}))).toBe('Preis auf Anfrage');
  });
});
