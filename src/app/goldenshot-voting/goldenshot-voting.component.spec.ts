import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTestDependencies } from '../../testing/test-providers';
import { GoldenshotVotingComponent } from './goldenshot-voting.component';

describe('GoldenshotVotingComponent', () => {
  let component: GoldenshotVotingComponent;
  let fixture: ComponentFixture<GoldenshotVotingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldenshotVotingComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(GoldenshotVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
