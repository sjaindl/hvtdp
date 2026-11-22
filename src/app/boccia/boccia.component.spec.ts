import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { BocciaComponent } from './boccia.component';

describe('BocciaComponent', () => {
  let component: BocciaComponent;
  let fixture: ComponentFixture<BocciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BocciaComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(BocciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
