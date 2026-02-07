import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { LabService } from '../../../lab.service';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ModalComponent } from '../../../../../shared/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    PaginationComponent,
    MatIcon,
    MatMenuModule,
    ModalComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  // =====================
  // DATA
  // =====================
  orders = signal<any[]>([]);
  total = signal(0);
  loading = signal(false);

  // =====================
  // PAGINATION & SEARCH
  // =====================
  page = signal(1);
  limit = signal(6);
  status = signal('');
  selectedStatus = signal('');

  // =====================
  // Modals
  // =====================
  isOpenViewOrder = false;
  selectedOrder:any;
  isOpenEditOrder = false;
  originalStatus = signal<string>('');
  editedStatus = signal<string>('');

  constructor(
    private _LabService: LabService,
    private _MatSnackBar:MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);

    const params: any = {
      page: this.page(),
      limit: this.limit(),
    };

    if (this.status().trim()) {
      params.status = this.status();
    }

    this._LabService
      .getOrders(params)
      .then((res) => {
        this.orders.set(res.data);
        this.total.set(res.total);
      })
      .finally(() => this.loading.set(false));
  }

  onPageChange(page: number): void {
    this.page.set(page);
    this.loadOrders();
  }

  changeStatus(status: string) {
    this.selectedStatus.set(status);
    this.page.set(1);
    this.status.set(status);
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

  openEditModal(order: any) {
    this.selectedOrder = order;
    this.originalStatus.set(order.status); // status الأصلي
    this.editedStatus.set(order.status); // المختار حاليًا
    this.isOpenEditOrder = true;
  }
  closeEditModal() {
    this.isOpenEditOrder = false;
    this.originalStatus.set('');
    this.editedStatus.set('');
  }

  updateOrder() {
    if (this.editedStatus() === this.originalStatus()) return;

    const orderId = this.selectedOrder.id;

    const body = {
      status: this.editedStatus(),
    };

    this._LabService.updateOrderStatus(orderId, body).subscribe({
      next: () => {
        // Update UI locally
        this.selectedOrder.status = this.editedStatus();

        this.closeEditModal();
        this.loadOrders(); // refresh table
        this._MatSnackBar.open('Status updated succeefully', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
      error: (err) => {
        this._MatSnackBar.open(err.error.message, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  openDeleteModal() {}
}
