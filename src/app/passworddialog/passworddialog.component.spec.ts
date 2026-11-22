import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { provideTestDependencies } from '../../testing/test-providers';
import { PassworddialogComponent } from './passworddialog.component';

describe('PassworddialogComponent', () => {
  let component: PassworddialogComponent;
  let fixture: ComponentFixture<PassworddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassworddialogComponent],
      providers: [
        ...provideTestDependencies(),
        { provide: MatDialogRef, useValue: { close: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassworddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
