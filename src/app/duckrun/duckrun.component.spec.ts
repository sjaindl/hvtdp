import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuckrunComponent } from './duckrun.component';

describe('DuckrunComponent', () => {
  let component: DuckrunComponent;
  let fixture: ComponentFixture<DuckrunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DuckrunComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuckrunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
