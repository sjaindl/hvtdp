import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerOfTheSeasonComponent } from './playeroftheseason.component';

describe('PlayerOfTheSeasonComponent', () => {
  let component: PlayerOfTheSeasonComponent;
  let fixture: ComponentFixture<PlayerOfTheSeasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerOfTheSeasonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerOfTheSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
