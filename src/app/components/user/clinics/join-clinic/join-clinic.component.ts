import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClinicService } from '../clinic.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-join-clinic',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
  ],
  templateUrl: './join-clinic.component.html',
  styleUrl: './join-clinic.component.scss',
})
export class JoinClinicComponent implements OnInit {
  clinics: any[] = [];
  searchText = '';
  distance = 20;
  selectedClinicId: string | null = null;
  isJoinClinicAsOperatorModalOpen = false;
  form!: FormGroup;

  selectedClinic: any = null;
  selectedRole: 'owner' | 'sub_owner' | 'operator' = 'owner';

  constructor(
    private clinicService: ClinicService,
    private fb: FormBuilder,
    private SnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.buildForm();
    this.searchClinics();
  }

  private buildForm() {
    this.form = this.fb.group({
      isStockBased: [true, Validators.required],
      doctorPercentage: [
        { value: null },
        [Validators.min(0), Validators.max(100)],
      ],
      clinicPercentage: [
        { value: null },
        [Validators.min(0), Validators.max(100)],
      ],
      checkupPrice: [{ value: null }, [Validators.min(0)]],
    });
  }

  get pctSumInvalid(): boolean {
    if (!this.form.get('isStockBased')!.value) return false;
    const d = Number(this.form.get('doctorPercentage')!.value ?? 0);
    const c = Number(this.form.get('clinicPercentage')!.value ?? 0);
    return Math.round((d + c) * 10) / 10 !== 100;
  }

  get showDoctorPctError() {
    const ctrl = this.form.get('doctorPercentage')!;
    return (
      this.form.get('isStockBased')!.value &&
      ctrl.invalid &&
      (ctrl.dirty || ctrl.touched)
    );
  }
  get showClinicPctError() {
    const ctrl = this.form.get('clinicPercentage')!;
    return (
      this.form.get('isStockBased')!.value &&
      ctrl.invalid &&
      (ctrl.dirty || ctrl.touched)
    );
  }
  get showPriceError() {
    const ctrl = this.form.get('checkupPrice')!;
    return (
      !this.form.get('isStockBased')!.value &&
      ctrl.invalid &&
      (ctrl.dirty || ctrl.touched)
    );
  }

  get disableSave(): boolean {
    if (this.form.get('isStockBased')!.value) {
      return (
        this.showDoctorPctError || this.showClinicPctError || this.pctSumInvalid
      );
    } else {
      return (
        this.showPriceError || this.form.get('checkupPrice')!.value === null
      );
    }
  }

  syncClinicPercentage() {
    const d = Number(this.form.get('doctorPercentage')!.value ?? 0);
    if (d >= 0 && d <= 100) {
      this.form
        .get('clinicPercentage')!
        .setValue(Math.max(0, Math.min(100, 100 - d)), { emitEvent: false });
    }
  }
  syncDoctorPercentage() {
    const c = Number(this.form.get('clinicPercentage')!.value ?? 0);
    if (c >= 0 && c <= 100) {
      this.form
        .get('doctorPercentage')!
        .setValue(Math.max(0, Math.min(100, 100 - c)), { emitEvent: false });
    }
  }

  async searchClinics() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const params = {
            name: this.searchText || '',
            lat,
            lng,
            distanceInKm: this.distance,
          };
          try {
            const res = await this.clinicService
              .getAvailableClinics(params)
              .toPromise();
            this.clinics = res;
          } catch (error) {
            this.SnackBar.open(
              '❌ Error fetching clinics. Please try again later.',
              'Close',
              { duration: 3000 }
            );
          }
        },
        (error) => {
          alert('Please allow location access to find nearby clinics.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  closeJoinClinic() {
    this.isJoinClinicAsOperatorModalOpen = false;
    this.form.reset({
      isStockBased: true,
      doctorPercentage: null,
      clinicPercentage: null,
      checkupPrice: null,
    });
  }

  async joinClinic(clinicId: string, role: 'owner' | 'sub_owner' | 'operator') {
    this.selectedClinicId = clinicId;
    this.selectedRole = role;

    if (role === 'operator') {
      this.isJoinClinicAsOperatorModalOpen = true;
    } else {
      const payload = { type: role };
      this.clinicService.joinClinic(clinicId, payload).subscribe(
        (res) => {
          this.SnackBar.open(res.message, 'Close', { duration: 3000 });
        },
        (error) => {
          console.log(error);
          this.SnackBar.open(error.error.message, 'Close', { duration: 3000 });
        }
      );
    }
  }

  async submit() {
  if (this.disableSave || !this.selectedClinicId) return;

  const isStock = !!this.form.value.isStockBased;
  const base = { type: 'operator' };

  const payload = isStock
    ? {
        ...base,
        stockType: 'clinic', 
        consultationFee: Number(this.form.value.checkupPrice), 
        doctorShare: Number(this.form.value.doctorPercentage), 
      }
    : {
        ...base,
        stockType: 'self', 
        consultationFee: Number(this.form.value.checkupPrice),
        doctorShare: Number(this.form.value.doctorPercentage), 
      };

  this.clinicService.joinClinic(this.selectedClinicId, payload).subscribe(
    (res) => {
      this.SnackBar.open(res.message, 'Close', { duration: 3000 });
      this.closeJoinClinic();
    },
    (error) => {
      this.SnackBar.open(error.error.message, 'Close', { duration: 3000 });
      this.closeJoinClinic();
    }
  );
}

}
