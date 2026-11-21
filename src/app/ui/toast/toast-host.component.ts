import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-3 px-4 pb-[env(safe-area-inset-bottom)]"
      aria-live="polite"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3.5 text-[15px] font-medium text-white shadow-xl"
          role="status"
        >
          <span
            class="material-icons text-[22px]"
            [class.text-pink-600]="toast.type !== 'info'"
            [class.text-gray-400]="toast.type === 'info'"
            >{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</span
          >
          <span>{{ toast.message }}</span>
          @if (toast.actionLabel) {
            <button
              type="button"
              class="font-bold text-pink-100 hover:text-white"
              (click)="toast.action?.(); toastService.dismiss(toast.id)"
            >
              {{ toast.actionLabel }}
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class ToastHostComponent {
  constructor(public toastService: ToastService) {}
}
