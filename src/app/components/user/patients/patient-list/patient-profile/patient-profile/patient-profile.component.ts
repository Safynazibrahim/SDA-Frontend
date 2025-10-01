import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [TranslateModule, MatIconModule, RouterLink, RouterOutlet, MatTabsModule,
    CommonModule, RouterModule
  ],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent {
  selectedIndex = 0;
  currentTitle: string = 'appointment_history';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild;
        if (child) {
          const routePath = child.snapshot.routeConfig?.path;
          const tab = this.tabs.find(t => t.link === routePath);
          if (tab) {
            this.currentTitle = tab.label;
          }
        }
      });
  }

  tabs = [
    { label: 'appointment_history', link: 'appointment-history' },
    { label: 'dental_history',      link: 'dental-history' },
    { label: 'dental_chart',        link: 'dental-chart' },
    { label: 'medical_history',     link: 'medical-history' }
  ];

  
}
