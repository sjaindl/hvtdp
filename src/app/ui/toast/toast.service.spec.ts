import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = TestBed.inject(ToastService);
  });

  it('shows a toast and hides it after 3 seconds', fakeAsync(() => {
    service.show('Text kopiert');
    expect(service.toasts().map((toast) => [toast.message, toast.type])).toEqual([
      ['Text kopiert', 'success'],
    ]);

    tick(2999);
    expect(service.toasts().length).toBe(1);
    tick(1);
    expect(service.toasts().length).toBe(0);
  }));

  it('shows the real error below an error message for 6 seconds', fakeAsync(() => {
    const retry = jasmine.createSpy('retry');
    service.showError(
      'Senden fehlgeschlagen',
      new HttpErrorResponse({ error: 'Voting beendet', status: 400 }),
      'Erneut',
      retry
    );

    const [toast] = service.toasts();
    expect(toast.type).toBe('error');
    expect(toast.message).toBe('Senden fehlgeschlagen');
    expect(toast.detail).toBe('Voting beendet');
    expect(toast.actionLabel).toBe('Erneut');
    toast.action?.();
    expect(retry).toHaveBeenCalled();

    tick(3000);
    expect(service.toasts().length).toBe(1);
    tick(3000);
    expect(service.toasts().length).toBe(0);
  }));

  it('dismisses a single toast and keeps the others', fakeAsync(() => {
    service.show('Eins');
    service.show('Zwei', 'info');
    service.dismiss(service.toasts()[0].id);
    expect(service.toasts().map((toast) => toast.message)).toEqual(['Zwei']);
    tick(3000);
  }));
});
