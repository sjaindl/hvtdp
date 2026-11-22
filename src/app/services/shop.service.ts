import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Item, OptionGroup } from '../shared/items';
import { StrapiMedia, mediaUrl } from '../shared/utils/media.util';
import { CmsService } from './cms.service';

interface StrapiOptionGroup {
  label: string;
  kind: 'Auswahl' | 'Text';
  required: boolean | null;
  placeholder: string | null;
  choices: { label: string; price: number | string | null }[] | null;
}

interface StrapiShopItem {
  name: string;
  description: string | null;
  category: string;
  image: StrapiMedia | null;
  price: number | string | null;
  priceNote: string | null;
  optionGroups: StrapiOptionGroup[] | null;
}

/** Decimal fields can arrive as strings depending on the database. */
const toPrice = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const price = Number(value);
  return Number.isNaN(price) ? null : price;
};

/** Fanshop items from Strapi. */
@Injectable({ providedIn: 'root' })
export class ShopService {
  private cms = inject(CmsService);

  getItems(): Observable<Item[]> {
    return this.cms
      .getCollection<StrapiShopItem>('shop-items', {
        'sort[0]': 'order:asc',
        'populate[image]': true,
        'populate[optionGroups][populate][choices]': true,
      })
      .pipe(
        map((items) =>
          items.map((item) => ({
            name: item.name.trim(),
            description: item.description ?? '',
            category: item.category,
            imageUrl: mediaUrl(item.image, 'small'),
            imageLargeUrl: mediaUrl(item.image, 'medium'),
            price: toPrice(item.price),
            priceNote: item.priceNote ?? '',
            optionGroups: (item.optionGroups ?? []).map(
              (group): OptionGroup => ({
                label: group.label,
                kind: group.kind === 'Text' ? 'text' : 'choice',
                required: group.required ?? true,
                placeholder: group.placeholder ?? '',
                choices: (group.choices ?? []).map((choice) => ({
                  label: choice.label,
                  price: toPrice(choice.price),
                })),
              })
            ),
          }))
        )
      );
  }
}
