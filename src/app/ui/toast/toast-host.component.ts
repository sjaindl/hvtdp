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
          class="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl bg-gray-900 px-4 py-3.5 text-[15px] font-medium text-white shadow-xl"
          [attr.role]="toast.type === 'error' ? 'alert' : 'status'"
        >
          <span
            class="material-icons text-[22px]"
            [class.text-pink-600]="toast.type !== 'info'"
            [class.text-gray-400]="toast.type === 'info'"
            >{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</span
          >
          <span class="min-w-0 flex-1">
            {{ toast.message }}
            @if (toast.detail) {
              <span class="mt-0.5 block break-words text-[13px] font-normal text-gray-300">{{ toast.detail }}</span>
            }
          </span>
          @if (toast.actionLabel) {
            <button
              type="button"
              class="shrink-0 font-bold text-pink-100 hover:text-white"
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
