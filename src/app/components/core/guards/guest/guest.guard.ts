import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, map, take } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    filter((status) => status !== null),
    take(1),
    map((loggedIn) => {
      if (loggedIn) {
        // لو logged in → redirect للـ dashboard
        router.navigate(['/dashboard']);
        return false;
      } else {
        return true; // يخش على login عادي
      }
    })
  );
};
