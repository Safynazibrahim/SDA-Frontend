import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { LabService } from '../../../lab.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NearbyLabsComponent } from '../../../nearby-labs/nearby-labs.component';
type LabViewMode = 'list' | 'empty' | 'nearby';
@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [CommonModule, TranslateModule, PaginationComponent, MatIcon, NearbyLabsComponent],
  templateUrl: './laboratory.component.html',
  styleUrl: './laboratory.component.scss',
})
export class LaboratoryComponent implements OnInit {
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
  limit = signal(4);
  searchNameValue = '';
  search = signal('');

  viewMode = signal<LabViewMode>('list');

  constructor(
    private _LabService: LabService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadLabs();
  }

  loadLabs(): void {
    this.loading.set(true);

    const params: any = {
      page: this.page(),
      limit: this.limit(),
    };

    this._LabService
      .getLabs(params)
      .then((res) => {
        this.labs.set(res.data);
        this.total.set(res.total);
        if (res.data.length === 0) {
          this.viewMode.set('empty');
        } else {
          this.viewMode.set('list');
        }
      })
      .finally(() => this.loading.set(false));
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadLabs();
  }

  showNearby() {
    this.viewMode.set('nearby');
  }

  goToDetails(labId: string) {
    console.log('Clicked labId:', labId);
    this.router.navigate(['/dashboard/labs/lab-details', labId]);
  }
}
