import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    // استنى لحد ما الـ auth status يتحدد (مش null)
    filter((status) => status !== null),
    take(1),
    map((loggedIn) => {
      if (loggedIn) {
        return true;
      } else {
        // الـ navigation هيحصل هنا بس لما نتأكد إن مفيش authentication
        router.navigate(['/login']);
        return false;
      }
    })
  );
};