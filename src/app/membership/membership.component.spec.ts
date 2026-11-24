import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { provideTestDependencies } from '../../testing/test-providers';
import { MembershipComponent } from './membership.component';

describe('MembershipComponent', () => {
  let component: MembershipComponent;
  let fixture: ComponentFixture<MembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipComponent],
      providers: provideTestDependencies(),
    }).compileComponents();

    fixture = TestBed.createComponent(MembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the "as of" date of each member list from the team page', () => {
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${environment.cmsUrl}/api/team-page`).flush({
      data: {
        squadAsOf: '2025-12-01',
        activeMembersAsOf: '2026-09-11',
        supportingMembersAsOf: null,
        kidsMembersAsOf: '2026-10-23',
      },
    });
    expect(component.groups.map((group) => group.asOf)).toEqual([
      'Stand 11.09.2026',
      '',
      'Stand 23.10.2026',
    ]);
  });
});
