import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../../../shared/search/search.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { LabService } from '../../../lab.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    TranslateModule,
    SearchComponent,
    CommonModule,
    PaginationComponent,
    MatIcon,
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
})
export class RequestsComponent implements OnInit {
  constructor(private _LabService: LabService) {}

  // =====================
  // DATA
  // =====================
  labRequests = signal<any[]>([]);
  total = signal(0);
  loading = signal(false);

  // =====================
  // PAGINATION & SEARCH
  // =====================
  page = signal(1);
  limit = signal(6);
  searchNameValue = '';
  search = signal('');

  ngOnInit(): void {
    this.loadLabRequests();
  }

  loadLabRequests(): void {
    this.loading.set(true);

    const params: any = {
      page: this.page(),
      limit: this.limit(),
    };
    if (this.search().trim()) {
      params.search = this.search();
    }

    this._LabService
      .getRequests(params)
      .then((res) => {
        this.labRequests.set(res.data);
        this.total.set(res.total);
      })
      .finally(() => this.loading.set(false));
  }

  onSearch() {
    this.page.set(1);
    this.search.set(this.searchNameValue);
    this.loadLabRequests();
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadLabRequests();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'accepted':
        return 'check_circle'; // ✅
      case 'rejected':
        return 'cancel'; // ❌
      case 'waiting':
        return 'hourglass_top'; // ⏳
      default:
        return 'help_outline';
    }
  }
}
