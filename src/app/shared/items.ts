/** A selectable option of an option group, e.g. "L/XL"; a price replaces the item price when chosen. */
export interface OptionChoice {
  label: string;
  price: number | null;
}

/** An order option of a fanshop item: a choice (chips) or a free text field (e.g. initials, voucher amount). */
export interface OptionGroup {
  label: string;
  kind: 'choice' | 'text';
  required: boolean;
  placeholder: string;
  choices: OptionChoice[];
}

export interface Item {
  name: string;
  description: string;
  category: string;
  /** Card size (500px). */
  imageUrl: string | null;
  /** Larger size for the order sheet and the fullscreen viewer. */
  imageLargeUrl: string | null;
  /** Base price in euros; null when the item has no fixed price (see priceNote). */
  price: number | null;
  /** Shown instead of a price, e.g. "Betrag frei wählbar". */
  priceNote: string;
  optionGroups: OptionGroup[];
}
