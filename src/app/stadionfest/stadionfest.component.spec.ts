import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { StadionFestComponent } from './stadionfest.component';

describe('StadionFestComponent', () => {
  let component: StadionFestComponent;
  let fixture: ComponentFixture<StadionFestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadionFestComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(StadionFestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
