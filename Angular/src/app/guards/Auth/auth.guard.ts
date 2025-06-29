import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn(); // už kontroluje localStorage

  if (isLoggedIn) {
    return true;
  } else {
    console.warn('[authGuard] Není přihlášen – přesměrovávám');
    router.navigate(['/home']);
    return false;
  }
};
