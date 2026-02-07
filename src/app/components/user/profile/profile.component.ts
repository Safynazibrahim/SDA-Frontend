import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ProfileService } from './profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    MatIcon,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  showPassword = false;
  medicalLicenseFile: File | null = null; // الجديد
  certificateFiles: File[] = []; // الجديد
  medicalLicenseName: string | null = null; // القديم
  certificateNames: string[] = []; // القديم
  profileForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private _ProfileService: ProfileService,
    private _MatSnackBar: MatSnackBar,
    private translate: TranslateService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  logout() {
    this.authService.logout();  // استدعاء logout في AuthService
  }

  // 🟢 1. إنشاء الفورم مرة واحدة
  private initForm() {
    this.profileForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      appointmentDuration: [{ value: '', disabled: true }],
    });
  }

  // 🟢 2. جلب الداتا من API
  private loadProfile() {
    this._ProfileService.getDoctorProfile().subscribe({
      next: (res) => {
        console.log('📦 Profile Response:', res);

        this.profileForm.patchValue({
          fullName: res.fullName,
          email: res.email,
          phoneNumber: res.phoneNumber,
          appointmentDuration: res.doctor?.appointmentDuration,
        });

        // 🟢 ملفات قديمة (عرض فقط)
        this.medicalLicenseName = res.doctor?.medicalLicense || null;
        this.certificateNames = res.doctor?.academicCertificates || [];
      },
      error: (err) => {
        this._MatSnackBar.open(
          err.error?.message || 'Failed to load profile',
          'Close',
          {
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  enableEdit() {
    this.isEditMode = true;
    this.profileForm.enable();
    this.profileForm.get('email')?.disable();
  }

  cancelEdit() {
    this.isEditMode = false;
    this.profileForm.disable();
    this.loadProfile();
  }

  onFileSelected(event: any, field: 'medicalLicense' | 'certificate') {
    const files: FileList = event.target.files;

    console.log(event);

    if (field === 'medicalLicense') {
      this.medicalLicenseFile = files[0];
    } else {
      this.certificateFiles = Array.from(files);
    }
  }

  triggerFileInput(inputId: string) {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  submit() {
    if (this.profileForm.invalid) return;

    const formData = new FormData();

    // ✅ objects as JSON strings
    formData.append(
      'basicInfo',
      JSON.stringify({
        fullName: this.profileForm.value.fullName,
        phoneNumber: this.profileForm.value.phoneNumber,
      })
    );

    formData.append(
      'doctorInfo',
      JSON.stringify({
        appointmentDuration: this.profileForm.value.appointmentDuration,
      })
    );

    // ✅ files
    if (this.medicalLicenseFile) {
      formData.append('medicalLicense', this.medicalLicenseFile);
    }

    this.certificateFiles.forEach((file) => {
      formData.append('academicCertificates', file);
    });

    this._ProfileService.updateProfile(formData).subscribe({
      next: () => {
        this._MatSnackBar.open(
          this.translate.instant('PROFILE_UPDATED_SUCCESS'),
          this.translate.instant('Close'),
          {
            duration: 3000,
            panelClass: ['snackbar-success'],
          }
        );
        this.isEditMode = false;
        this.profileForm.disable();
        this.loadProfile();
      },
      error: (err) => {
        const messageKey = err?.error?.message || 'PROFILE_UPDATE_FAILED';
        this._MatSnackBar.open(
          this.translate.instant(messageKey),
          this.translate.instant('Close'),
          {
            duration: 3000,
            panelClass: ['snackbar-error'],
          }
        );
      },
    });
  }
}
