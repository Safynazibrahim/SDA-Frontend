import { Component, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LabService } from '../../../lab.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../shared/modal/modal.component';

@Component({
  selector: 'app-expences',
  standalone: true,
  imports: [MatIcon, TranslateModule, PaginationComponent, CommonModule, ModalComponent],
  templateUrl: './expences.component.html',
  styleUrl: './expences.component.scss',
})
export class ExpencesComponent implements OnInit {
  // =====================
  // DATA
  // =====================
  totalExpenses = signal(0);
  loading = signal(false);
  orders = signal<any[]>([]);
  totalOrders = signal(0);

  // =====================
  // PAGINATION
  // =====================
  page = signal(1);
  limit = signal(6);

  // =====================
  // View Modal
  // =====================
  isOpenViewOrder = false;
  selectedOrder:any;

  constructor(private _LabService: LabService) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadOrders();
  }

  loadExpenses(): void {
    this.loading.set(true);

    this._LabService
      .getExpenses()
      .then((res) => {
        this.totalExpenses.set(res.total);
      })
      .finally(() => this.loading.set(false));
  }

  loadOrders(): void {
    this.loading.set(true);

    const params: any = {
      page: this.page(),
      limit: this.limit(),
      status : 'completed'
    };

    this._LabService
      .getOrders(params)
      .then((res) => {
        this.orders.set(res.data);
        this.totalOrders.set(res.total);
      })
      .finally(() => this.loading.set(false));
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadOrders();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'waiting':
        return 'schedule';
      case 'in_progress':
        return 'autorenew';
      case 'try_in':
        return 'visibility';
      case 'completed':
        return 'check_circle';
      default:
        return 'help_outline';
    }
  }

  getOrderDetails(orderId: number) {
    this._LabService
      .getOrderDetails(orderId)
      .then((res) => {
        this.selectedOrder = res;
      })
      .finally(() => this.loading.set(false));
  }

  openViewModal(orderId: number) {
    this.isOpenViewOrder = true;
    this.getOrderDetails(orderId);
  }
  closeViewModal() {
    this.isOpenViewOrder = false;
  }
}
