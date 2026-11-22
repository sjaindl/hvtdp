import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { BigdartsComponent } from './bigdarts.component';

describe('BigdartsComponent', () => {
  let component: BigdartsComponent;
  let fixture: ComponentFixture<BigdartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigdartsComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(BigdartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
