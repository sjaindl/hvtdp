import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  actionLabel?: string;
  action?: () => void;
}

/** Lightweight toasts (design: "Toast/Success|Info|Error"), shown bottom-center for 3 seconds. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  show(message: string, type: ToastType = 'success', actionLabel?: string, action?: () => void) {
    const toast: Toast = { id: this.nextId++, message, type, actionLabel, action };
    this.toasts.update((toasts) => [...toasts, toast]);
    setTimeout(() => this.dismiss(toast.id), 3000);
  }

  dismiss(id: number) {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
