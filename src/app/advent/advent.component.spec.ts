import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { AdventComponent } from './advent.component';

describe('AdventComponent', () => {
  let component: AdventComponent;
  let fixture: ComponentFixture<AdventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdventComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(AdventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
