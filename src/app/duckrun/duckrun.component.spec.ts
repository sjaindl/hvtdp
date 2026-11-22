import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { DuckrunComponent } from './duckrun.component';

describe('DuckrunComponent', () => {
  let component: DuckrunComponent;
  let fixture: ComponentFixture<DuckrunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuckrunComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(DuckrunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
