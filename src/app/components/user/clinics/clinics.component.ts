import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClinicService } from './clinic.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [TranslateModule, CommonModule, PaginationComponent, RouterModule, FormsModule , MatIcon],
  templateUrl: './clinics.component.html',
  styleUrl: './clinics.component.scss'
})
export class ClinicsComponent implements OnInit {
  constructor(private router: Router, private clinicsService: ClinicService) {}

  ownerCurrentPage = 1;
  operatorCurrentPage = 1;
  subOwnerCurrentPage = 1;
  limit = 10;

  ownerClinicsData: any[] = [];
  operatorClinicsData: any[] = [];
  subOwnerClinicsData: any[] = [];

  ownerTotal = 0;
  operatorTotal = 0;
  subOwnerTotal = 0;

  searchName = '';

  ngOnInit(): void {
    this.fetchClinics();
  }

  fetchClinics() {
  this.clinicsService.getClinics({
    ownerPage: this.ownerCurrentPage,
    operatorPage: this.operatorCurrentPage,
    subOwnerPage: this.subOwnerCurrentPage,
    limit: this.limit,
    name: this.searchName || ''
  }).subscribe({
    next: (res) => {
      console.log('Clinics response', res);

      this.ownerClinicsData = res?.ownerClinics?.data || [];
      this.operatorClinicsData = res?.operatorClinics?.data || [];
      this.subOwnerClinicsData = res?.subOwnerClinics?.data || [];

      this.ownerTotal = res?.ownerClinics?.total || 0;
      this.operatorTotal = res?.operatorClinics?.total || 0;
      this.subOwnerTotal = res?.subOwnerClinics?.total || 0;
    },
    error: (err) => {
      console.error('Error fetching clinics:', err);
    }
  });
}


  onOwnerPageChange(page: number) {
    this.ownerCurrentPage = page;
    this.fetchClinics();
  }

  onOperatorPageChange(page: number) {
    this.operatorCurrentPage = page;
    this.fetchClinics();
  }

  onSubOwnerPageChange(page: number) {
    this.subOwnerCurrentPage = page;
    this.fetchClinics();
  }

  onSearch() {
    this.ownerCurrentPage = 1;
    this.operatorCurrentPage = 1;
    this.subOwnerCurrentPage = 1;
    this.fetchClinics();
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
  goToClinicDetails(id: any) {
    this.router.navigate(['/dashboard/clinics', id]);
  }
}
