import { Injectable, NgZone } from '@angular/core';
import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { environment } from '../../../../environments/environment';
import { messaging } from '../../../../firebase/firebase';
import { NotificationStateService } from './notification-state.service';
import { ApiServiceService } from '../../../api-service.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  constructor(
    private notificationState: NotificationStateService,
    private api: ApiServiceService,
    private ngZone: NgZone,
  ) {}

  requestPermission(): Promise<string | null> {
    return getToken(messaging, {
      vapidKey: environment.vapidKey,
    })
      .then((token: string | null) => {
        if (!token) {
          console.warn('No FCM token generated');
          return null;
        }
        return token;
      })
      .catch((err: unknown) => {
        console.error('FCM error:', err);
        return null;
      });
  }

  listen(): void {
    onMessage(messaging, (payload: MessagePayload) => {
      console.log('Message received:', payload);

      // ✅ رجّعي التنفيذ لجوه Angular
      this.ngZone.run(() => {
        // 1) زوّد badge فورًا
        this.notificationState.increment();

        // 2) (اختياري) sync مع API
        this.api.get('notifications', { page: 1, limit: 100 }).subscribe({
          next: (res: any) => {
            const list = res?.data ?? [];
            const unread = list.filter((n: any) => n?.isRead === false).length;
            this.notificationState.setUnread(unread);
          },
        });
      });
    });
  }
}
