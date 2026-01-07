import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-labs-system',
  standalone: true,
  imports: [TranslateModule, CommonModule, RouterLink, RouterLinkActive, MatIcon, RouterOutlet],
  templateUrl: './labs-system.component.html',
  styleUrl: './labs-system.component.scss',
})
export class LabsSystemComponent {
  currentTitle: string = 'Laboratory';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
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
    { label: 'Laboratory', link: 'laboratory' },
    { label: 'lab_requests',      link: 'requests' },
    { label: 'orders',        link: 'orders' },
    { label: 'expences',     link: 'expenses' }
  ];

}
