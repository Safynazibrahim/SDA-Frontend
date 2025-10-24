import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map((loggedIn) => {
      if (loggedIn === false) {
        router.navigate(['/login']);
        return false;
      }
      // loggedIn === true OR null (unknown) → allow
      // any invalid session will 401 on the first API call and the interceptor will refresh or logout
      return true;
    })
  );
};
