import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { LabService } from '../../../lab.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [CommonModule, TranslateModule, PaginationComponent, MatIcon],
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

  constructor(private _LabService: LabService) {}

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
      })
      .finally(() => this.loading.set(false));
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadLabs();
  }

  goToDetails(lab: any) {
    // this._Router.navigate([`/dashboard/patients/${patient.id}`]);
  }
}
