import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, map, take } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map((loggedIn) => {
      if (loggedIn) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true; // allow login/register
    })
  );
};
