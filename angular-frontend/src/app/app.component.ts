import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/component/toast/toast.component';
import { BrowserModule } from '@angular/platform-browser';
import { ToasterService } from './shared/services/toaster.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-frontend';

  private toastService = inject(ToasterService)

  showToastSuccess() {
    this.toastService.success('Perfecto', 'esto es un mensaje success')
  }

  showToastError() {
    this.toastService.error('Error', 'esto es un mensaje de error')
  }

  showToastInfo() {
    this.toastService.info('Info', 'esto es un mensaje de info')
  }

  showToastWarning() {
    this.toastService.warning('Warning', 'esto es un mensaje de warning')
  }
}

