import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsService } from './notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationStateService } from '../../core/services/notification-state.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    TranslateModule,
    MatIcon,
    RouterLink,
    CommonModule,
    PaginationComponent,
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  constructor(
    private notificationsService: NotificationsService,
    private snackBar: MatSnackBar,
    private notificationState: NotificationStateService,
  ) {}

  sideBar = false;

  // pagination
  CurrentPage = signal(1);
  limit = signal(10);

  // data
  notifications: any[] = [];
  total = 0;
  loading = false;

  // ============================
  // 🚀 ngOnInit
  // ============================
  ngOnInit(): void {
    this.getNotifications();
  }

  // ============================
  // 🔥 API CALL (NORMAL)
  // ============================
  getNotifications(): void {
    this.loading = true;

    const params = {
      page: this.CurrentPage(),
      limit: this.limit(),
    };

    this.notificationsService.getNotifications(params).subscribe({
      next: (res: any) => {
        this.notifications = res.data || [];
        this.total = res.total || 0;
        const unread = this.notifications.filter(
          (n) => n?.isRead === false,
        ).length;
        this.notificationState.setUnread(unread);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.snackBar.open(
          err?.error?.message || 'Error loading notifications',
          'Close',
          {
            duration: 3000,
            panelClass: ['snackbar-error'],
          },
        );
      },
    });
  }

  onPageChange(page: number) {
    this.CurrentPage.set(page);
    this.getNotifications();
  }

  markAsRead(notification: any): void {
    // لو مقروء قبل كده، اعملي ignore
    if (notification.isRead) return;

    this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => {
        // 1️⃣ حدّثي الـ UI محليًا
        notification.isRead = true;
        this.snackBar.open(
          'Mark notification as read successfully',
          'Close',
          {
            duration: 3000,
            panelClass: ['snackbar-error'],
          },
        );
        // 2️⃣ قلّلي badge فورًا
        this.notificationState.unreadCount.update((c) => Math.max(c - 1, 0));
      },
      error: (err) => {
        this.snackBar.open(
          err?.error?.message || 'Failed to mark notification as read',
          'Close',
          {
            duration: 3000,
            panelClass: ['snackbar-error'],
          },
        );
      },
    });
  }

  // ============================
  openDetails() {
    this.sideBar = true;
  }

  closeDetails() {
    this.sideBar = false;
  }
}
