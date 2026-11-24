import { Item } from '../items';

const NUMBER = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 14.9 → "14,90 €" (amount first, as the club writes prices). */
export function formatPrice(price: number): string {
  return `${NUMBER.format(price)} €`;
}

/** Price shown on a fanshop card: "14,90 €", "ab 12,90 €" when options change the price, or the price note. */
export function priceLabel(item: Item): string {
  const choicePrices = item.optionGroups
    .flatMap((group) => group.choices.map((choice) => choice.price))
    .filter((price): price is number => price !== null);
  // The item price applies unless a required option prices every choice (as in the order sheet).
  const choiceDecides = item.optionGroups.some(
    (group) =>
      group.required &&
      group.choices.length > 0 &&
      group.choices.every((choice) => choice.price !== null)
  );
  const prices =
    item.price !== null && !choiceDecides ? [...choicePrices, item.price] : choicePrices;
  if (!prices.length) {
    return item.priceNote || 'Preis auf Anfrage';
  }
  const lowest = Math.min(...prices);
  return Math.max(...prices) > lowest ? `ab ${formatPrice(lowest)}` : formatPrice(lowest);
}
