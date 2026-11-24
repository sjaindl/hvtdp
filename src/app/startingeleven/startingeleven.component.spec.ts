import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { StartingelevenComponent } from './startingeleven.component';

describe('StartingelevenComponent', () => {
  let component: StartingelevenComponent;
  let fixture: ComponentFixture<StartingelevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartingelevenComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(StartingelevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
