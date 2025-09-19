import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, finalize } from 'rxjs/operators';
import { ApiServiceService } from '../../../api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean | null>(null);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  
  private refreshTokenRequest$: Observable<any> | null = null;

  constructor(private _ApiServiceService: ApiServiceService, private router: Router) {
    this.checkAuthOnStartup();
  }

  private checkAuthOnStartup() {
    // جرب refresh token مرة واحدة عند بداية التطبيق
    this.refreshToken().subscribe({
      next: () => {
        console.log('✅ User authenticated');
        this.isLoggedInSubject.next(true);
      },
      error: () => {
        console.log('❌ User not authenticated');
        this.isLoggedInSubject.next(false);
      }
    });
  }

  setAuthStatus(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  login(data: { email: string; password: string }) {
    return this._ApiServiceService.post('auth/signin', data);
  }

  refreshToken(): Observable<any> {
    // لو في refresh request شغال حاليًا، استخدم نفس الـ request
    if (this.refreshTokenRequest$) {
      console.log('Using existing refresh request...');
      return this.refreshTokenRequest$;
    }

    console.log('Creating new refresh request...');
    
    this.refreshTokenRequest$ = this._ApiServiceService.post('auth/refresh', {}).pipe(
      shareReplay(1), // كاش النتيجة للـ subscribers اللي جاية
      finalize(() => {
        // امسح الـ request لما يخلص
        this.refreshTokenRequest$ = null;
      })
    );

    return this.refreshTokenRequest$;
  }

  logout() {
    // امسح أي refresh request موجود
    this.refreshTokenRequest$ = null;
    
    this._ApiServiceService.post('auth/logout', {}).subscribe(() => {
      this.isLoggedInSubject.next(false);
      this.router.navigate(['/login']);
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