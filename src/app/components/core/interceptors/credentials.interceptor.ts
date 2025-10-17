import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const clonedReq = req.clone({
    withCredentials: true,
  });

  // تجاهل نفس طلبات الـ refresh و signin لتجنب الـ loop
  if (req.url.includes('auth/refresh') || req.url.includes('auth/signin')) {
    return next(clonedReq);
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // في حالة 401 (token expired)
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        console.log('🔄 Access token expired — trying refresh...');

        return authService.refreshToken().pipe(
          switchMap(() => {
            isRefreshing = false;
            console.log('✅ Token refreshed, retrying original request...');
            return next(req.clone({ withCredentials: true }));
          }),
          catchError(refreshErr => {
            isRefreshing = false;
            console.error('❌ Refresh failed — logging out');
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      } else if (error.status === 401 && isRefreshing) {
        // لو refresh شغال بالفعل، تجاهل الطلب مؤقتًا
        console.log('⚠️ Refresh already in progress, skipping...');
        return of(error as any);
      }

      return throwError(() => error);
    })
  );
};
