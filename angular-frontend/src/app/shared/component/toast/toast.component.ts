import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { Subscription } from 'rxjs';
import { Toast } from '../../interfaces/toast';

@Component({
  selector: 'app-toast',
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0}),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1}))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  private toasterService = inject(ToasterService);
  
  toasts: Toast[] = []
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.subscription = this.toasterService.toasts$.subscribe(toasts => this.toasts = toasts)
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  removeToast(id: number) {
    this.toasterService.remove(id)
  }

  trackToast(index: number, toast: Toast) {
    return toast.id;
  }
  
}
