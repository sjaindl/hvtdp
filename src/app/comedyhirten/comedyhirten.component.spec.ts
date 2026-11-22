import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { ComedyhirtenComponent } from './comedyhirten.component';

describe('ComedyhirtenComponent', () => {
  let component: ComedyhirtenComponent;
  let fixture: ComponentFixture<ComedyhirtenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComedyhirtenComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(ComedyhirtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
