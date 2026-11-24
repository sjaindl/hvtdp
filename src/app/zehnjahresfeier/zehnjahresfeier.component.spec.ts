import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { ZehnjahresfeierComponent } from './zehnjahresfeier.component';

describe('ZehnjahresfeierComponent', () => {
  let component: ZehnjahresfeierComponent;
  let fixture: ComponentFixture<ZehnjahresfeierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZehnjahresfeierComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(ZehnjahresfeierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
