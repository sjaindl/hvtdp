import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { HallofpappComponent } from './hallofpapp.component';

describe('HallofpappComponent', () => {
  let component: HallofpappComponent;
  let fixture: ComponentFixture<HallofpappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallofpappComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(HallofpappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
