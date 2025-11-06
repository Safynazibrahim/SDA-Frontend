import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OnInit } from '@angular/core';
import { from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StartCaseStateService } from '../start-case/start-case-state.service';
import { AppointmentsService } from '../appointments.service';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CaseStateService } from '../assign-case/case-state.service';
@Component({
  selector: 'app-manual-diagnosis',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ModalComponent,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './manual-diagnosis.component.html',
  styleUrl: './manual-diagnosis.component.scss',
})
export class ManualDiagnosisComponent implements OnInit {
  diagnosisName = '';
  treatmentPlan = '';
  instructionBetweenVisits = '';
  treatmentProgress = 50;
  progressOffset: string = '';
  isDropdownOpen = false;
  openIndex: number | null = null;
  selectedMedication = '';
  clinicId: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private startCaseState: StartCaseStateService,
    private assignCaseState: CaseStateService,
    private _AppointmentsService: AppointmentsService,
    private snackBar: MatSnackBar
  ) {}
  medications = [
    {
      name: 'Medicine Name',
      dosage: '',
      frequency: '',
      duration: '',
      safe: true,
    },
    {
      name: 'Medicine Name',
      dosage: '',
      frequency: '',
      duration: '',
      safe: true,
    },
    {
      name: 'Medicine Name',
      dosage: '',
      frequency: '',
      duration: '',
      safe: true,
    },
    {
      name: 'Medicine Name',
      dosage: '',
      frequency: '',
      duration: '',
      safe: true,
    },
  ];
  isNextVisitModalOpen = false; // 🔹 الحالة اللي بتتحكم في إظهار المودال

  openNextVisitModal() {
    this.isNextVisitModalOpen = true;
  }

  closeNextVisitModal() {
    this.isNextVisitModalOpen = false;
  }

  appointmentId: string | null = null;
  patientId: string | null = null;
  fromPage: any;
  fromDays: number | null = null;
  toDays: number | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  caseId: number | null = null;

  ngOnInit() {
    this.calculateProgress();
    this.fromPage = this.route.snapshot.queryParamMap.get('from');

    const id = this.route.snapshot.paramMap.get('id');
    if (this.fromPage === 'appointments') this.appointmentId = id;
    else if (this.fromPage === 'patient-profile') this.patientId = id;

    console.log(
      '🩺 fromPage:',
      this.fromPage,
      'appointmentId:',
      this.appointmentId
    );
    this.clinicId = this.startCaseState.getClinicId();
    this.caseId = this.assignCaseState.getCaseData()?.caseId || null;
    console.log('🏥 Retrieved clinicId in Manual Diagnosis:', this.clinicId);
  }
  // sendManualDiagnosis() {
  //   const startCaseData = this.startCaseState.getStartCaseData();
  //   if (!startCaseData) {
  //     this.snackBar.open('⚠️ Missing start case data', 'Close', { duration: 3000 });
  //     return;
  //   }

  //   // 🧩 نجمع كل الداتا النهائية
  //   const payload = {
  //     appointmentId: startCaseData.appointmentId,
  //     chiefComplaint: startCaseData.chiefComplaint,
  //     clinicalInvestigation: startCaseData.clinicalInvestigation,
  //     diagnosis: this.diagnosisName,
  //     treatmentPlan: this.treatmentPlan,
  //     instructionsBetweenVisits: this.instructionBetweenVisits,
  //     medications: this.medications.filter(m => m.dosage || m.frequency || m.duration),
  //   };

  //   console.log('📤 Sending Manual Diagnosis payload:', payload);

  //   this._AppointmentsService.startCase(payload).subscribe({
  //     next: (res) => {
  //       console.log('✅ Manual Diagnosis saved successfully', res);
  //       this.snackBar.open('Diagnosis sent successfully ✅', 'Close', { duration: 3000 });

  //       // بعد الإرسال ترجعي لصفحة المواعيد أو البروفايل
  //       if (this.fromPage === 'appointments') {
  //         this.router.navigate(['/dashboard/appointments']);
  //       } else {
  //         this.router.navigate([`/dashboard/patients/${this.patientId}/appointment-history`]);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('❌ Error sending manual diagnosis', err);
  //       this.snackBar.open('Failed to send diagnosis ❌', 'Close', { duration: 3000 });
  //     },
  //   });
  // }
  sendManualDiagnosis() {
    const startCaseData = this.startCaseState.getStartCaseData();
    if (!startCaseData) {
      this.snackBar.open('⚠️ Missing start case data', 'Close', {
        duration: 3000,
      });
      return;
    }

    const payload = {
      appointmentId: startCaseData.appointmentId,
      chiefComplaint: startCaseData.chiefComplaint,
      clinicalInvestigation: startCaseData.clinicalInvestigation,
      diagnosis: this.diagnosisName,
      treatmentPlan: this.treatmentPlan,
      instructionsBetweenVisits: this.instructionBetweenVisits,
      medications: this.medications.filter(
        (m) => m.dosage || m.frequency || m.duration
      ),
    };

    console.log('📤 Sending Manual Diagnosis payload:', payload);

    this._AppointmentsService.startCase(payload,this.caseId).subscribe({
      next: (res) => {
        console.log('✅ Manual Diagnosis saved successfully', res);
        this.snackBar.open('Diagnosis sent successfully ✅', 'Close', {
          duration: 3000,
        });

        // 🔹 بدل ما نرجع فورًا، نفتح المودال
        this.openNextVisitModal();
      },
      error: (err) => {
        console.error('❌ Error sending manual diagnosis', err);
        // this.openNextVisitModal();
        this.snackBar.open('Failed to send diagnosis ❌', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.openIndex = null; // reset any open section when closing
  }

  toggleMed(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  calculateProgress() {
    const circumference = 2 * Math.PI * 54;
    const offset =
      circumference - (this.treatmentProgress / 100) * circumference;
    this.progressOffset = offset.toString();
  }
  cancelHandler() {
    if (this.fromPage === 'appointments') {
      this.router.navigate(['/dashboard/appointments']);
    }
    if (this.fromPage === 'patient-profile') {
      this.router.navigate([
        `dashboard/patients/${this.patientId}/appointment-history`,
      ]);
    }
  }

  goBackToPatoentProfile() {
    this.router.navigate([
      `dashboard/patients/${this.patientId}/appointment-history`,
    ]);
  }

 showAvailableSlots() {
  // if (!this.clinicId || !this.fromDays || !this.toDays) {
  //   this.snackBar.open('⚠️ Please select date range first', 'Close', { duration: 3000 });
  //   return;
  // }

  const recoveryPeriodInDays = this.fromDays;
  const searchWindowInDays = this.toDays;

  console.log('📅 Fetching available slots...', {
    clinicId: this.clinicId,
    recoveryPeriodInDays,
    searchWindowInDays
  });

  this._AppointmentsService
    .showAvailableTimeSlots(this.clinicId, recoveryPeriodInDays, searchWindowInDays)
    .subscribe({
      next: (res) => {
        console.log('✅ Available slots:', res);
        this.snackBar.open('Available slots loaded ✅', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('❌ Error fetching slots', err);
        this.snackBar.open('Failed to load available slots ❌', 'Close', { duration: 3000 });
      },
    });
}


  completeNextVisit() {
    console.log('✅ Complete next visit');
    this.closeNextVisitModal();

    // بعدين هنا ممكن تضيفي navigation أو أي logic إضافي
    if (this.fromPage === 'appointments') {
      this.router.navigate(['/dashboard/appointments']);
    } else {
      this.router.navigate([
        `/dashboard/patients/${this.patientId}/appointment-history`,
      ]);
    }
  }
}
