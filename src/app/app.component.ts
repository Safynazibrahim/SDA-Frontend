import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/auth/login/login.component";
import { RegisterComponent } from "./components/auth/register/register.component";
import { ForgetPassComponent } from "./components/auth/forget-pass/forget-pass.component";
import { LoaderService } from './components/core/services/loader.service';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { FirebaseMessagingService } from './components/core/services/firebase-messaging.service';
import { ApiServiceService } from './api-service.service';
console.log('Environment:', environment);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SDA';
  constructor(
    public loader: LoaderService,
    private firebaseMsg: FirebaseMessagingService,
    private api: ApiServiceService
  ) {}

  ngOnInit(): void {
    // 🚀 1) اطلب إذن النوتيفيكيشن
    this.firebaseMsg.requestPermission().then(token => {
      if (token) {
        console.log("FCM Token:", token);
        // 🚀 2) أبعت التوكين للباك
        this.api.saveDeviceToken(token).subscribe({
          next: () => console.log("Token sent to backend successfully"),
          error: (err) => console.error("Error sending token:", err)
        });
      }
    });

    // 🚀 3) استلم أي نوتيفيكيشن جديدة
    this.firebaseMsg.listen();
  }

}