import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [TranslateModule, CommonModule, PaginationComponent],
  templateUrl: './clinics.component.html',
  styleUrl: './clinics.component.scss'
})
export class ClinicsComponent {
  ownerCurrentPage = 1;
  operatorCurrentPage = 1;
  subOwnerCurrentPage = 1;

  onOwnerPageChange(page: number) {
    this.ownerCurrentPage = page;
    console.log('Owner Clinics Page:', page);
  }

  onOperatorPageChange(page: number) {
    this.operatorCurrentPage = page;
    console.log('Operator Clinics Page:', page);
  }

  onSubOwnerPageChange(page: number) {
    this.subOwnerCurrentPage = page;
    console.log('Sub-owner Clinics Page:', page);
  }
}
