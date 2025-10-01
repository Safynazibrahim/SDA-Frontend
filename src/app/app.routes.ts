import { Routes } from '@angular/router';
import { guestGuard } from './components/core/guards/guest/guest.guard';
import { authGuard } from './components/core/guards/auth/auth.guard';

export const routes: Routes = [
  // Public layout
  {
    path: '',
    loadComponent: () =>
      import('./components/layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/public/home/home-component.component').then(
            (m) => m.HomeComponentComponent
          ),
      },
      {
        path: 'pricing',
        loadComponent: () =>
          import('./components/public/pricing/pricing.component').then(
            (m) => m.PricingComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
        canActivate: [guestGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        canActivate: [guestGuard],
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import('./components/auth/forget-pass/forget-pass.component').then(
            (m) => m.ForgetPassComponent
          ),
        canActivate: [guestGuard],
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/layouts/user-layout/user-layout.component').then(
        (m) => m.UserLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'homeDashboard', pathMatch: 'full' },
      {
        path: 'homeDashboard',
        loadComponent: () =>
          import('./components/user/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/user/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'patient-list',
        loadComponent: () =>
          import(
            './components/user/patients/patient-list/patient-list.component'
          ).then((m) => m.PatientListComponent),
      },
      {
        path: 'patients/:id',
        loadComponent: () =>
          import(
            './components/user/patients/patient-list/patient-profile/patient-profile/patient-profile.component'
          ).then((m) => m.PatientProfileComponent),
        children: [
          { path: '', redirectTo: 'appointment-history', pathMatch: 'full' },
          {
            path: 'appointment-history',
            loadComponent: () =>
              import(
                './components/user/patients/patient-list/patient-profile/patient-profile/patient-profile-sections/appointment-history/appointment-history.component'
              ).then((m) => m.AppointmentHistoryComponent),
          },
          {
            path: 'dental-history',
            loadComponent: () =>
              import(
                './components/user/patients/patient-list/patient-profile/patient-profile/patient-profile-sections/dental-history/dental-history.component'
              ).then((m) => m.DentalHistoryComponent),
          },
          {
            path: 'dental-chart',
            loadComponent: () =>
              import(
                './components/user/patients/patient-list//patient-profile/patient-profile/patient-profile-sections/dental-chart/dental-chart.component'
              ).then((m) => m.DentalChartComponent),
          },
          {
            path: 'medical-history',
            loadComponent: () =>
              import(
                './components/user/patients/patient-list/patient-profile/patient-profile/patient-profile-sections/medical-history/medical-history.component'
              ).then((m) => m.MedicalHistoryComponent),
          },
        ],
      },
      {
        path: 'assigned-cases',
        loadComponent: () =>
          import(
            './components/user/patients/assigned-cases/assigned-cases.component'
          ).then((m) => m.AssignedCasesComponent),
      },
      {
        path: 'clinics',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./components/user/clinics/clinics.component').then(
                (m) => m.ClinicsComponent
              ),
          },
          {
            path: 'join',
            loadComponent: () =>
              import(
                './components/user/clinics/join-clinic/join-clinic.component'
              ).then((m) => m.JoinClinicComponent),
          },
          {
            path: 'operatorPackage',
            loadComponent: () =>
              import(
                './components/user/clinics/operator-packages/operator-packages.component'
              ).then((m) => m.OperatorPackagesComponent),
          },
          {
            path: 'clinicPackage',
            loadComponent: () =>
              import(
                './components/user/clinics/clinic-packages/clinic-packages.component'
              ).then((m) => m.ClinicPackagesComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './components/user/clinics/clinic-home/clinic-home.component'
              ).then((m) => m.ClinicHomeComponent),
            children: [
              { path: '', redirectTo: 'home', pathMatch: 'full' },
              {
                path: 'home',
                loadComponent: () =>
                  import(
                    './components/user/clinics/clinic-home/clinic-home-sections/clinic-home-section/clinic-home-section.component'
                  ).then((m) => m.ClinicHomeSectionComponent),
              },
              {
                path: 'appointments',
                loadComponent: () =>
                  import(
                    './components/user/clinics/clinic-home/clinic-home-sections/clinic-appiontments-section/clinic-appiontments-section.component'
                  ).then((m) => m.ClinicAppiontmentsSectionComponent),
              },
              {
                path: 'packages',
                loadComponent: () =>
                  import(
                    './components/user/clinics/clinic-home/clinic-home-sections/clinic-packages-section/clinic-packages-section.component'
                  ).then((m) => m.ClinicPackagesSectionComponent),
              },
              {
                path: 'inventory',
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        './components/user/clinics/clinic-home/clinic-home-sections/clinic-inventory-section/clinic-inventory-section.component'
                      ).then((m) => m.ClinicInventorySectionComponent),
                  },
                  {
                    path: 'add',
                    loadComponent: () =>
                      import(
                        './components/user/clinics/clinic-home/clinic-home-sections/add-material/add-material.component'
                      ).then((m) => m.AddMaterialComponent),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
