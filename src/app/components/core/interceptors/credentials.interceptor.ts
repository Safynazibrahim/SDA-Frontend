import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError, delay, filter, take, Subject } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshCompleted$ = new Subject<void>();

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const clonedReq = req.clone({ withCredentials: true });

  // avoid loops on auth endpoints
  if (req.url.includes('auth/refresh') || req.url.includes('auth/signin') || req.url.includes('auth/logout')) {
    return next(clonedReq);
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // first 401 triggers refresh
      if (!isRefreshing) {
        isRefreshing = true;
        return authService.refreshToken().pipe(
          // tiny wait so the browser applies the new cookies
          delay(150),
          switchMap(() => {
            isRefreshing = false;
            refreshCompleted$.next(); // wake up queued requests
            // retry original request with fresh cookies
            return next(req.clone({ withCredentials: true }));
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            refreshCompleted$.next(); // unblock queued requests
            authService.logout();     // refresh expired → force logout
            return throwError(() => refreshErr);
          })
        );
      }

      // if a refresh is already running, queue this request until it finishes
      return refreshCompleted$.pipe(
        filter(() => !isRefreshing),
        take(1),
        switchMap(() => next(req.clone({ withCredentials: true })))
      );
    })
  );
};
