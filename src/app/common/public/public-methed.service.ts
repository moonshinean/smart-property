import { Injectable } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/primeng';
import {LoginService} from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class PublicMethedService {

  public cleanTimer: any;
  constructor(
    private messageService: MessageService) { }
  // set Toast
  public setToast(type, title, message): void {
    if (this.cleanTimer) {
      clearTimeout(this.cleanTimer);
    }
    this.messageService.clear();
    this.messageService.add({severity: type, summary: title, detail: message});
    this.cleanTimer = setTimeout(() => {
      this.messageService.clear();
    }, 3000);
  }
}
