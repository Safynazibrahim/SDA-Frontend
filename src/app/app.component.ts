import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgetPassComponent } from './components/auth/forget-pass/forget-pass.component';
import { LoaderService } from './components/core/services/loader.service';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { FirebaseMessagingService } from './components/core/services/firebase-messaging.service';
import { ApiServiceService } from './api-service.service';
import { NotificationStateService } from './components/core/services/notification-state.service';
import { AuthService } from './components/core/services/auth.service';
console.log('Environment:', environment);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'SDA';
  constructor(
    private auth: AuthService,
    public loader: LoaderService,
    private firebaseMsg: FirebaseMessagingService,
    private api: ApiServiceService,
    private notificationState: NotificationStateService,
  ) {}

  ngOnInit(): void {
    // اسمعي auth state
    this.auth.isLoggedIn$.subscribe((loggedIn) => {
      if (loggedIn) {
        // 1️⃣ حمّلي unread
        this.loadUnreadCountFromList();
        // 2️⃣ ابعتي device token
        this.sendDeviceToken();
        // 3️⃣ ابدئي listening
        this.firebaseMsg.listen();
      } else {
        this.notificationState.reset();
      }
    });
  }

  private loadUnreadCountFromList(): void {
    this.api.get('notifications', { page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        const unread = (res?.data ?? []).filter(
          (n: any) => n?.isRead === false,
        ).length;
        this.notificationState.setUnread(unread);
      },
      error: () => this.notificationState.setUnread(0),
    });
  }
  private async sendDeviceToken() {
    const token = await this.firebaseMsg.requestPermission();
    if (token) {
      this.api.saveDeviceToken(token).subscribe();
    }
  }
}
