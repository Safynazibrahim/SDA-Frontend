import { Routes } from '@angular/router';
import { guestGuard } from './components/core/guards/guest/guest.guard';
import { authGuard } from './components/core/guards/auth/auth.guard';


export const routes: Routes = [
  // Public layout
  {
    path: '',
    loadComponent: () => import('./components/layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./components/public/home/home-component.component').then(m => m.HomeComponentComponent) },
      { path: 'pricing', loadComponent: () => import('./components/public/pricing/pricing.component').then(m => m.PricingComponent) },
      { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),  },
      { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent),  },
      { path: 'forget-password', loadComponent: () => import('./components/auth/forget-pass/forget-pass.component').then(m => m.ForgetPassComponent),  },
    ]
  },

  // User layout
  {
    path: 'dashboard',
    loadComponent: () => import('./components/layouts/user-layout/user-layout.component')
      .then(m => m.UserLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'clinics', pathMatch: 'full' },
      { path: 'homeDashboard', loadComponent: () => import('./components/user/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'profile', loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'clinics', loadComponent: () => import('./components/user/clinics/clinics.component').then(m => m.ClinicsComponent) }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
