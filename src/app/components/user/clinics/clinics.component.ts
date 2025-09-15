import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [TranslateModule, CommonModule, PaginationComponent , RouterModule],
  templateUrl: './clinics.component.html',
  styleUrl: './clinics.component.scss'
})
export class ClinicsComponent {
  constructor(private router: Router) {}
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
  goToJoinClinic() {
    this.router.navigate(['/dashboard/clinics/join']);
  }
  goToOperatorPackage() {
    this.router.navigate(['/dashboard/clinics/operatorPackage']);
  }
  goToClinicPackage() {
    this.router.navigate(['/dashboard/clinics/clinicPackage']);
  }
  goToClinicDetails(id: number) {
    this.router.navigate(['/dashboard/clinics', id]);
  }
}
