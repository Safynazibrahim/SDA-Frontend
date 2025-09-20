import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateCompiler, TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from 'express';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../../../../shared/modal/modal.component';

@Component({
  selector: 'app-clinic-inventory-section',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    PaginationComponent, 
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
    ModalComponent], 
  templateUrl: './clinic-inventory-section.component.html',
  styleUrl: './clinic-inventory-section.component.scss'
})
export class ClinicInventorySectionComponent {

  isViewModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;

openEditModal() {
  this.isEditModalOpen = true;
}

openViewModal() {
  this.isViewModalOpen = true;
}

openDeleteModal() {
  this.isDeleteModalOpen = true;
}

closeEditModal() {
  this.isEditModalOpen = false;
}

closeViewModal() {
  this.isViewModalOpen = false;
}

closeDeleteModal() {
  this.isDeleteModalOpen = false;
}

  selectedStatus:any;
  CurrentPage=1

  changeStatus(status:any){
  this.selectedStatus = status; 
  }
  onPageChange(page: number) {
    this.CurrentPage = page;
    
  }
}
