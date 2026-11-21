import { Injectable, signal } from '@angular/core';
import { ErrorUtil } from '../../shared/utils/error.util';

export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  id: number;
  message: string;
  /** Second line, e.g. the error returned by the API. */
  detail?: string;
  type: ToastType;
  actionLabel?: string;
  action?: () => void;
}

/** Lightweight toasts (design: "Toast/Success|Info|Error"), shown bottom-center for 3 seconds (errors with details: 6). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  show(message: string, type: ToastType = 'success', actionLabel?: string, action?: () => void) {
    this.add({ id: this.nextId++, message, type, actionLabel, action }, 3000);
  }

  /** Error toast that shows the real error (see `ErrorUtil.message`) below the message. */
  showError(message: string, error: unknown, actionLabel?: string, action?: () => void) {
    const detail = ErrorUtil.message(error);
    this.add({ id: this.nextId++, message, detail, type: 'error', actionLabel, action }, 6000);
  }

  private add(toast: Toast, duration: number) {
    this.toasts.update((toasts) => [...toasts, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number) {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
