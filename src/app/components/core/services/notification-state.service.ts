import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationStateService {
  unreadCount = signal(0);

  setUnread(count: number) {
    this.unreadCount.set(count);
  }

  increment() {
    this.unreadCount.update(c => c + 1);
  }

  reset() {
    this.unreadCount.set(0);
  }
}
