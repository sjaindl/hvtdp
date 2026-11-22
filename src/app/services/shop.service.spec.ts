import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { Item } from '../shared/items';
import { ShopService } from './shop.service';

describe('ShopService', () => {
  let service: ShopService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: provideTestDependencies() });
    service = TestBed.inject(ShopService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('maps items with prices, options and image sizes', () => {
    let items: Item[] = [];
    service.getItems().subscribe((result) => (items = result));

    const request = http.expectOne((r) => r.url === `${environment.cmsUrl}/api/shop-items`);
    expect(request.request.params.get('populate[optionGroups][populate][choices]')).toBe('true');
    request.flush({
      data: [
        {
          name: ' Kapperl ',
          description: 'Kappe',
          category: 'Accessoires',
          image: {
            url: '/uploads/kapperl.jpeg',
            formats: {
              small: { url: '/uploads/small_kapperl.jpeg', width: 500, height: 500 },
              medium: { url: '/uploads/medium_kapperl.jpeg', width: 1000, height: 1000 },
            },
          },
          price: '21.00',
          priceNote: null,
          optionGroups: [
            {
              label: 'Ausführung',
              kind: 'Auswahl',
              required: true,
              placeholder: null,
              choices: [{ label: 'Mit Logo', price: 25 }],
            },
            {
              label: 'Initialen',
              kind: 'Text',
              required: false,
              placeholder: 'optional',
              choices: null,
            },
          ],
        },
        {
          name: 'Gutschein',
          description: null,
          category: 'Sonstiges',
          image: null,
          price: null,
          priceNote: 'Betrag frei wählbar',
          optionGroups: null,
        },
      ],
      meta: { pagination: { page: 1, pageCount: 1 } },
    });

    const [cap, voucher] = items;
    expect(cap.name).toBe('Kapperl');
    expect(cap.price).toBe(21);
    expect(cap.imageUrl).toBe(`${environment.cmsUrl}/uploads/small_kapperl.jpeg`);
    expect(cap.imageLargeUrl).toBe(`${environment.cmsUrl}/uploads/medium_kapperl.jpeg`);
    expect(cap.optionGroups).toEqual([
      {
        label: 'Ausführung',
        kind: 'choice',
        required: true,
        placeholder: '',
        choices: [{ label: 'Mit Logo', price: 25 }],
      },
      { label: 'Initialen', kind: 'text', required: false, placeholder: 'optional', choices: [] },
    ]);
    expect(voucher.price).toBeNull();
    expect(voucher.priceNote).toBe('Betrag frei wählbar');
    expect(voucher.description).toBe('');
    expect(voucher.optionGroups).toEqual([]);
  });
});
