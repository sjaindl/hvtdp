import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { KleinfeldTurnierComponent } from './kleinfeldturnier.component';

describe('KleinfeldTurnierComponent', () => {
  let component: KleinfeldTurnierComponent;
  let fixture: ComponentFixture<KleinfeldTurnierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KleinfeldTurnierComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(KleinfeldTurnierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
