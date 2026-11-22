import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { ImagesliderComponent } from './imageslider.component';

describe('ImagesliderComponent', () => {
  let component: ImagesliderComponent;
  let fixture: ComponentFixture<ImagesliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesliderComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(ImagesliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
