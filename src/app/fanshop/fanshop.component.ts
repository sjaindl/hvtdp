import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HvtdpImageComponent } from '../hvtdp-image/hvtdp-image.component';
import { MysqlService } from '../services/mysql.service';
import { baseUrlImages } from '../shared/baseurls';
import { Item } from '../shared/items';

@Component({
  selector: 'app-fanshop',
  templateUrl: './fanshop.component.html',
  styleUrls: ['./fanshop.component.css'],
  standalone: true,
  imports: [CommonModule, HvtdpImageComponent],
})
export class FanshopComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  categories: string[] = [];
  selectedCategory = 'Alle';
  imageBaseUrl: String;
  itemsLoaded = false;

  constructor(
    private mysqlService: MysqlService,
    private titleService: Title,
    private metaTagService: Meta
  ) {}

  ngOnInit(): void {
    this.imageBaseUrl = baseUrlImages;

    this.mysqlService.getItems().subscribe((items) => {
      this.items = (items || []).map((item) => ({
        ...item,
        category: this.normalizeCategory(item),
      }));
      this.setupCategories();
      this.applyFilter('Alle');
      this.itemsLoaded = true;
    });

    this.titleService.setTitle('HV TDP Stainz: Fanshop');
    this.metaTagService.updateTag({
      name: 'description',
      content: 'Handtücher, Fan-Shirts, Mützen & Co aus dem offizellen Fanshop des HV TDP Stainz.',
    });

    this.metaTagService.addTags([
      {
        name: 'keywords',
        content: 'Fußballverein, Stainz, SC Stainz, Fußballverein Stainz, HVTDP, HVTDP Stainz',
      },
      { name: 'author', content: 'Stefan Jaindl' },
      { charset: 'UTF-8' },
    ]);
  }

  applyFilter(category: string): void {
    this.selectedCategory = category;
    this.filteredItems =
      category === 'Alle'
        ? [...this.items]
        : this.items.filter((item) => item.category === category);
  }

  private setupCategories(): void {
    const categorySet = new Set<string>(this.items.map((item) => item.category));
    this.categories = ['Alle', ...Array.from(categorySet)];
  }

  private normalizeCategory(item: Item): string {
    return (item?.category || 'Sonstiges').toString();
  }
}
