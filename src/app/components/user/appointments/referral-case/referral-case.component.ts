import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReferralService } from './referral.service';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './../../../shared/search/search.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-referral-case',
  standalone: true,
  imports: [
    TranslateModule,
    SearchComponent,
    CommonModule,
    PaginationComponent,
    ReactiveFormsModule,
    ModalComponent,
    MatIcon
],
  templateUrl: './referral-case.component.html',
  styleUrl: './referral-case.component.scss',
})
export class ReferralCaseComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private referralService: ReferralService,
    private fb: FormBuilder
  ) {}

  // =========================
  // Basic State
  // =========================
  selectedTab: 'refer_clinic' | 'refer_another_clinic' = 'refer_clinic';

  caseId: any;
  clinicId: any;

  doctors: any[] = [];
  total = 0;
  loading = false;
  referForm!: FormGroup;
  showDoctorsInClinic = false;
  selectedClinicId: string | null = null;
  clinicDoctors: any[] = [];
  hasResults = false;
  selectedClinicName: string | null = null;

  // =========================
  // Pagination (refer_clinic only)
  // =========================
  currentPage = 1;
  limit = 10;

  // =========================
  // Search (refer_another_clinic only)
  // =========================
  searchNameValue = '';

  // =========================
  // Location (refer_another_clinic)
  // =========================
  lat: number | null = null;
  lng: number | null = null;
  readonly distanceInKm = 20; // 🔒 fixed

  // =========================
  // Init
  // =========================
  ngOnInit(): void {
    this.caseId = this.route.snapshot.paramMap.get('id');
    this.clinicId = this.route.snapshot.paramMap.get('clinicId');

    this.referForm = this.fb.group({
      referredDoctorId: [null, Validators.required],
      recoveryDays: [1, [Validators.required, Validators.min(1)]],
      note: ['', Validators.required],
    });

    this.referForm.get('recoveryDays')?.valueChanges.subscribe((value) => {
      if (value < 1) {
        this.referForm.get('recoveryDays')?.setValue(1, { emitEvent: false });
      }
    });

    // default tab load
    this.loadClinicDoctors();
  }

  // =========================
  // TAB CHANGE
  // =========================
  onTabChange(tab: 'refer_clinic' | 'refer_another_clinic') {
    if (this.selectedTab === tab) return;

    this.selectedTab = tab;
    this.resetData();

    if (tab === 'refer_clinic') {
      this.currentPage = 1;
      this.loadClinicDoctors();
    }

    if (tab === 'refer_another_clinic') {
      this.getUserLocationAndLoad();
    }
  }

  // =========================
  // REFER CLINIC (pagination only)
  // =========================
  async loadClinicDoctors() {
    this.loading = true;

    try {
      const res = await this.referralService.getDoctorsOfClinic(this.clinicId, {
        page: this.currentPage,
        limit: this.limit,
      });

      this.doctors = res?.data || [];
      this.hasResults = this.doctors.length > 0;
      this.total = res?.total || 0;
    } catch (err: any) {
      this.showError(err);
      this.hasResults = false;
    } finally {
      this.loading = false;
    }
  }

  onPageChange(page: number) {
    if (this.selectedTab !== 'refer_clinic') return;

    this.currentPage = page;
    this.loadClinicDoctors();
  }

  // =========================
  // REFER ANOTHER CLINIC (location)
  // =========================
  getUserLocationAndLoad() {
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
        this.loadNearbyDoctors();
      },
      () => {
        this.snackBar.open('Please allow location access', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  async loadNearbyDoctors() {
    if (this.lat === null || this.lng === null) return;

    this.loading = true;

    try {
      const res = await this.referralService.getDoctorsOfAnotherClinic({
        lat: this.lat,
        lng: this.lng,
        distanceInKm: this.distanceInKm,
      });

      this.doctors = res || [];
      this.hasResults = this.doctors.length > 0;
      // this.total = res?.total || 0;
    } catch (err: any) {
      this.showError(err);
      this.hasResults = false;
    } finally {
      this.loading = false;
    }
  }

  // =========================
  // SEARCH (refer_another_clinic only)
  // =========================
  async onSearch() {
    if (this.selectedTab !== 'refer_another_clinic') return;

    // 🔹 لو search فاضي → رجوع للـ nearby
    if (!this.searchNameValue.trim()) {
      this.loadNearbyDoctors();
      return;
    }

    // 🔹 لو في search
    this.loading = true;

    try {
      const res = await this.referralService.getDoctorsOfAnotherClinic({
        search: this.searchNameValue.trim(),
      });

      this.doctors = res || [];
      this.hasResults = this.doctors.length > 0;
      // this.total = res?.total || 0;
    } catch (err: any) {
      this.showError(err);
      this.hasResults = false;
    } finally {
      this.loading = false;
    }
  }

  // =========================
  // Helpers
  // =========================
  resetData() {
    this.doctors = [];
    this.total = 0;
    this.searchNameValue = '';
  }

  showError(err: any) {
    this.snackBar.open(err?.error?.message || 'Something went wrong', 'Close', {
      duration: 3000,
    });
  }

  // =========================
  // Submit referral
  // =========================

  async submitReferral() {
    if (this.referForm.invalid) {
      this.snackBar.open('Please complete all required fields', 'Close', {
        duration: 3000,
      });
      return;
    }

    const payload = {
      referredDoctorId: this.referForm.value.referredDoctorId,
      recoveryDays: this.referForm.value.recoveryDays,
      note: this.referForm.value.note,
    };

    this.loading = true;

    try {
      await this.referralService.referCase(this.caseId, payload);

      this.snackBar.open('Case referred successfully', 'Close', {
        duration: 3000,
      });

      this.referForm.reset();
    } catch (err: any) {
      this.showError(err);
    } finally {
      this.loading = false;
    }
  }

  // =========================
  // Modal of doctors
  // =========================
  async openClinicDoctors(clinic: any) {
    this.selectedClinicId = clinic.id;
    this.selectedClinicName = clinic.name;
    this.showDoctorsInClinic = true;
    await this.loadDoctorsInClinic(clinic.id);
  }

  async loadDoctorsInClinic(clinicId: string) {
    try {
      const res = await this.referralService.getDoctorsOfClinic(clinicId, {});
      this.clinicDoctors = res?.data || [];
    } catch (err: any) {
      this.showError(err);
    }
  }

  closeDoctorsModal() {
    this.showDoctorsInClinic = false;
  }

  selectDoctorFromModal(doctorId: string) {
    this.referForm.patchValue({
      referredDoctorId: doctorId,
    });
    this.closeDoctorsModal();
  }
}
