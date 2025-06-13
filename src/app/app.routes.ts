import { Routes } from '@angular/router';
import { guestGuard } from './components/core/guards/guest/guest.guard';
import { authGuard } from './components/core/guards/auth/auth.guard';


export const routes: Routes = [

    // Public routes (for all users)
  {
    path: '',
    loadComponent: () => import('./components/public/home/home-component.component').then(m => m.HomeComponentComponent),
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { 
        path: 'home', 
        loadComponent: () => import('./components/public/home/home-component.component').then(m => m.HomeComponentComponent)
      },
      { 
        path: 'login', 
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard] // Only for non-authenticated users
      },
      { 
        path: 'register', 
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [guestGuard] // Only for non-authenticated users
      }
    ]
  },

    // Protected routes (for authenticated users only)
  {
    path: 'dashboard',
    loadComponent: () => import('./components/layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/dashboard/home', pathMatch: 'full' },
      { 
        path: 'home', 
        loadComponent: () => import('./components/user/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Wildcard route
  { path: '**', redirectTo: '/home' }

];
