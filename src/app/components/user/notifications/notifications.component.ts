import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { NotificationsService } from './notifications.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    TranslateModule,
    MatIcon,
    RouterLink,
    CommonModule
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  constructor(
    private _NotificationsService:NotificationsService,
    private _MatSnackBar:MatSnackBar,
  ){}

  sideBar = false;
  CurrentPage = signal(1);
  limit = signal(10);

  // ⚙️ Computed params (auto-update when signals change)
      params = computed(() => ({
        page: this.CurrentPage(),
        limit: this.limit(),
      }));
    
      notificationsQuery = injectQuery(() => ({
      queryKey: ['notifications'], // ✅ shared key for caching
      queryFn: () => this._NotificationsService.getNotifications(this.params()),
      throwError: (err:any) => {
        this._MatSnackBar.open(err.error.message, 'Close', {
          duration:3000,
          panelClass:['snackbar-error']
        });
      },
    }));
    
      get doctors() {
        return this.notificationsQuery.data()?.data || [];
      }
      get total() {
        return this.notificationsQuery.data()?.total || 0;
      }

  openDetails() {
    this.sideBar = true;
  }

  
  closeDetails() {
    this.sideBar = false;
  }

}
