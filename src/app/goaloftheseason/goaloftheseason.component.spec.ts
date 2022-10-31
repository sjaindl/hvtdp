import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalOfTheSeasonComponent } from './goaloftheseason.component';

describe('GoalOfTheSeasonComponent', () => {
  let component: GoalOfTheSeasonComponent;
  let fixture: ComponentFixture<GoalOfTheSeasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalOfTheSeasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalOfTheSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
