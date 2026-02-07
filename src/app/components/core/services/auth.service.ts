import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, finalize } from 'rxjs/operators';
import { ApiServiceService } from '../../../api-service.service';
import { resetAuthInterceptorState } from '../interceptors/credentials.interceptor';
import { QueryClientService } from './query-client.service';
import { NotificationStateService } from './notification-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean | null>(null);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // private refreshTokenRequest$: Observable<any> | null = null;

  constructor(
    private _ApiServiceService: ApiServiceService,
    private router: Router,
    private queryClientService: QueryClientService,
    private notificationState:NotificationStateService
  ) {
    this.checkAuthOnStartup();
    // this.isLoggedInSubject.next(null);
  }

  checkAuthOnStartup(): Promise<void> {
    return new Promise((resolve) => {
      this.refreshToken().subscribe({
        next: () => {
          this.isLoggedInSubject.next(true);
          resolve();
        },
        error: () => {
          this.isLoggedInSubject.next(false);
          resolve();
        },
      });
    });
  }

  setAuthStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  login(data: { email: string; password: string }) {
    return this._ApiServiceService.post('auth/signin', data);
  }

  refreshToken() {
    // backend reads refresh cookie and sets new access cookie
    return this._ApiServiceService.post('auth/refresh', {}); // your post() already sets withCredentials
  }

  logout() {
    this._ApiServiceService.post('auth/logout', {}).subscribe({
      next: () => {
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
        resetAuthInterceptorState();
        this.queryClientService?.clear();
        this.notificationState.reset();
      },
      error: () => {
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
        resetAuthInterceptorState();
        this.queryClientService?.clear();
        this.notificationState.reset();
      },
    });
  }

  signUpDoctor(formData: FormData) {
    return this._ApiServiceService.post(`auth/signup/doctor`, formData);
  }

  requestOTP(formData: FormData) {
    return this._ApiServiceService.put(`auth/request-otp`, formData);
  }

  verifyOTP(data: { email: string; otp: string }) {
    return this._ApiServiceService.put('auth/verify-otp', data);
  }

  resetPassword(data: { newPassword: string }) {
    return this._ApiServiceService.put('auth/reset-password', data);
  }
}
