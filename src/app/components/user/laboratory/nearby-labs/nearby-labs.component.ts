import { Component, OnInit, signal } from '@angular/core';
import { LabService } from '../lab.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../../shared/search/search.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-nearby-labs',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    SearchComponent,
    PaginationComponent,
  ],
  templateUrl: './nearby-labs.component.html',
  styleUrl: './nearby-labs.component.scss',
})
export class NearbyLabsComponent implements OnInit {
  nearbyLabs = signal<any[]>([]);
  total = signal(0);
  loading = signal(true);
  lat: number = 0;
  lng: number = 0;
  page = signal(1);
  limit = signal(6);
  searchNameValue = '';
  search = signal('');
  distanceInKm = 6;

  constructor(
    private _LabService: LabService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getUserLocationAndLoadNearby();
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
        this.loadNearbyLabsInitial();
      },
      () => {
        this.loading.set(false);
        this.snackBar.open('Please allow location access', 'Close', {
          duration: 3000,
        });
      },
    );
  }
  loadNearbyLabsInitial(): void {
    if (this.lat === null || this.lng === null) return;

    this.loading.set(true);

    let params: any = {
      lat: this.lat,
      lng: this.lng,
      distanceInKm: this.distanceInKm,
      page: this.page(),
      limit: this.limit(),
    };

    const s = this.search()?.trim();
    if (s) {
      params.search = s;
    }

    this._LabService
      .getNearByLabs(params)
      .then((res) => {
        this.nearbyLabs.set(res.data ?? []);
        this.total.set(res.total ?? 0);
      })
      .catch((err) => {
        this.nearbyLabs.set([]);
        this.total.set(0);
        this.snackBar.open(
          err?.message || 'Failed to load nearby labs',
          'Close',
          {
            duration: 3000,
          },
        );
      })
      .finally(() => this.loading.set(false));
  }

  onSearch() {
    this.page.set(1);
    this.search.set(this.searchNameValue);
    this.loadNearbyLabsInitial();
  }
  onPageChange(page: number): void {
    this.page.set(page);
    this.loadNearbyLabsInitial();
  }

  sendRequestToLab(labId: string) {
    this._LabService.sendLinkRequest({ labId }).subscribe({
      next: () => {
        this.snackBar.open('Request sent successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackBar.open(
          err.error.message || 'Failed to send request',
          'Close',
          { duration: 3000 },
        );
      },
    });
  }
}
