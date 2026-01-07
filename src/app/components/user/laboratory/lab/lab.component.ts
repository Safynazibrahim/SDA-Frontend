import { LabService } from './../lab.service';
import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type LabsSource = 'none' | 'normal' | 'nearby';

@Component({
  selector: 'app-lab',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './lab.component.html',
  styleUrl: './lab.component.scss',
})
export class LabComponent implements OnInit {
  // =====================
  // DATA
  // =====================
  labs = signal<any[]>([]);
  total = signal(0);
  loading = signal(false);

  // =====================
  // PAGINATION & SEARCH
  // =====================
  page = signal(1);
  limit = signal(1);
  searchNameValue = '';
  search = signal('');

  // =====================
  // MODE
  // =====================
  isNearbyMode = signal(false);
  labsSource = signal<LabsSource>('none');

  // =====================
  // LOCATION
  // =====================
  lat: number | null = null;
  lng: number | null = null;
  readonly distanceInKm = 20;

  constructor(
    private _LabService: LabService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNormalLabs();
  }

  loadNormalLabs(): void {
    this.loading.set(true);
    this.isNearbyMode.set(false);

    const params: any = {
      page: this.page(),
      limit: this.limit(),
    };

    this._LabService
      .getLabs(params)
      .then((res) => {
        this.labs.set(res.data);
        this.total.set(res.total);

        if (res.data.length > 0) {
          this.router.navigate(['/dashboard/labs/system']);
        } else {
          this.labsSource.set('none');
        }
      })
      .finally(() => this.loading.set(false));
  }

  onFindNearby() {
    this.router.navigate(['/dashboard/labs/nearby']);
  }

  ///// get user location
  getUserLocationAndLoadNearby(): void {
    if (!navigator.geolocation) {
      this.snackBar.open('Geolocation not supported', 'Close', {
        duration: 3000,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.page.set(1);
        this.search.set('');
        this.loadNearbyLabsInitial();
      },
      () => {
        this.snackBar.open('Please allow location access', 'Close', {
          duration: 3000,
        });
      }
    );
  }
  loadNearbyLabsInitial(): void {
    if (this.lat === null || this.lng === null) return;

    this.loading.set(true);
    this.isNearbyMode.set(true);

    const params = {
      lat: this.lat,
      lng: this.lng,
      distanceInKm: this.distanceInKm,
      page: this.page(),
      limit: this.limit(),
    };

    this._LabService
      .getNearByLabs(params)
      .then((res) => {
        this.labs.set(res.data);
        this.total.set(res.total);

        if (res.data.length > 0) {
          this.labsSource.set('nearby');
        } else {
          // nearby رجّعت فاضية
          this.labsSource.set('none');
        }
      })
      .finally(() => this.loading.set(false));
  }
}
