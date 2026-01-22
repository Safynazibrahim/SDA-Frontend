import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
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
export class ManualDiagnosisComponent implements OnInit{
  diagnosisName = '';
  treatmentPlan = '';
  instructionBetweenVisits = '';
  treatmentProgress = 0;
  progressOffset: string = '';
  isDropdownOpen = false;
  openIndex: number | null = null;
  selectedMedication = ''; 
  clinicId: string | null = null;
  availableSlots: any = {}; 
hasSlots: boolean = false; 

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
  isNextVisitModalOpen = false; 

  openNextVisitModal() {
    this.isNextVisitModalOpen = true;
  }

  closeNextVisitModal() {
    this.isNextVisitModalOpen = false;
  }

  appointmentId: any;
  patientId: string | null = null;
  fromPage: any;
  fromDays: number | null = null;
  toDays: number | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  caseId: any;
selectedSlot: any = null;
selectedDate: string | null = null;
appointmentDate:any



  ngOnInit() {
    this.onProgressChange(this.treatmentProgress);
    this.fromPage = this.route.snapshot.queryParamMap.get('from');
    this.appointmentDate = this.route.snapshot.queryParamMap.get('date');

    const id = this.route.snapshot.paramMap.get('id');
    if (this.fromPage === 'appointments') this.appointmentId = id;
    else if (this.fromPage === 'patient-profile') this.patientId = id;

   
    this.clinicId = this.startCaseState.getClinicId();
    this.caseId = this.assignCaseState.getCaseData()?.caseId || null;
    this.loadCaseFromApi();
  }
  onProgressChange(value: number) {
  if (value < 0) value = 0;
  if (value > 100) value = 100;

  this.treatmentProgress = value;
  this.calculateProgress();
}
loadCaseFromApi() {
  this._AppointmentsService.getCaseById(this.appointmentId)
    .subscribe(res => {
      this.onProgressChange(res.progress);
      this.diagnosisName=res.diagnosis;
      this.treatmentPlan=res.treatmentPlan;
      this.instructionBetweenVisits=res.instructionsBetweenVisits;
    });
}
 sendManualDiagnosis() {
  const startCaseData = this.startCaseState.getStartCaseData();

  if (!startCaseData) {
    this.snackBar.open('Missing start case data', 'Close', { duration: 3000 });
    return;
  }

  const formData = new FormData();

  // ===============================
  // 🟢 Images
  // ===============================
  if (startCaseData.images?.length) {
  startCaseData.images.forEach((file: File) => {
    formData.append('images', file); // ✅ بدون []
  });
}


  // ===============================
  // 🟢 Primitive fields
  // ===============================
  formData.append('diagnosis', this.diagnosisName);
  formData.append('treatmentPlan', this.treatmentPlan);
  formData.append(
    'instructionsBetweenVisits',
    this.instructionBetweenVisits
  );
  formData.append('progress', String(this.treatmentProgress));

  // ===============================
  // 🟢 Complex objects (JSON)
  // ===============================
  formData.append(
    'chiefComplaint',
    JSON.stringify(startCaseData.chiefComplaint)
  );

  formData.append(
    'extraoralExamination',
    JSON.stringify(startCaseData.extraoralExamination)
  );

  formData.append(
    'periodontalExamination',
    JSON.stringify(startCaseData.periodontalExamination)
  );

  formData.append(
    'dentalOcclusion',
    JSON.stringify(startCaseData.dentalOcclusion)
  );

  formData.append(
    'diagnosisRisk',
    JSON.stringify(startCaseData.diagnosisRisk)
  );

  // ===============================
  // 🟢 Medications
  // ===============================
  const meds = this.medications
    .filter(m => m.dosage || m.frequency || m.duration)
    .map(m => ({
      name: m.name,
      dosage: Number(m.dosage),
      frequency: Number(m.frequency),
      duration: Number(m.duration),
    }));

  formData.append('medications', JSON.stringify(meds));

  const caseId = this.caseId ?? this.appointmentId;

  this._AppointmentsService.startCase(formData, caseId).subscribe({
    next: () => this.openNextVisitModal(),
    error: err =>
      this.snackBar.open(err.message || 'Error', 'Close', { duration: 3000 }),
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
     this.startCaseState.clearStartCaseData();
      this.startCaseState.clearClinicId();
      this.assignCaseState.clearCase();
    if (this.fromPage === 'appointments') {
       this.router.navigate(['/dashboard/appointments'], {
      queryParams: { date: this.appointmentDate }  
    });
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
  if(!this.clinicId){
    this.clinicId= this.assignCaseState.getClinicId()
  }
  if (!this.clinicId || !this.fromDays || !this.toDays) {
    this.snackBar.open('⚠️ Please enter both values', 'Close', { duration: 3000 });
    return;
  }

  const recoveryPeriodInDays = this.fromDays;
  const searchWindowInDays = this.toDays;

  this._AppointmentsService
    .showAvailableTimeSlots(this.clinicId, recoveryPeriodInDays, searchWindowInDays)
    .subscribe({
      next: (res) => {
        this.availableSlots = res; 
        this.hasSlots = true;
      },
      error: (err) => {
        this.hasSlots = false;
      },
    });
}
castToArray(value: any): any[] {
  return Array.isArray(value) ? value : [];
}

castToDate(value: any): Date | null {
  return value ? new Date(value) : null;
}




  completeNextVisit() {
  if (!this.selectedSlot || !this.selectedDate) {
    this.snackBar.open('Please select a time slot first', 'Close', {
      duration: 3000,
    });
    return;
  }

  const payload = {
    clinicId: this.clinicId,
    caseId: this.caseId,
    date: this.selectedDate,
    startTime: this.selectedSlot.startTime,
  };
  this._AppointmentsService.bookAppointment(payload).subscribe({
    next: (res) => {
      this.closeNextVisitModal();
       this.startCaseState.clearStartCaseData();
      this.startCaseState.clearClinicId();
      this.assignCaseState.clearCase();

      if (this.fromPage === 'appointments') {
        this.router.navigate(['/dashboard/appointments']);
      } else {
        this.router.navigate([
          `/dashboard/patients/${this.patientId}/appointment-history`,
        ]);
      }
    },
    error: (err) => {
      this.snackBar.open(err.message, 'Close', {
        duration: 3000,
      });
    },
  });
}

selectSlot(slot: any, dateKey: unknown) {
  this.selectedSlot = slot;
  this.selectedDate = String(dateKey);
  this.appointmentDate=this.selectedDate
  const payload = {
    clinicId: this.clinicId,
    caseId: this.caseId,
    date: this.selectedDate,
    startTime: this.selectedSlot.startTime,
  };
  this._AppointmentsService.bookAppointment(payload).subscribe({
    next: (res) => {
      this.closeNextVisitModal();
       this.startCaseState.clearStartCaseData();
      this.startCaseState.clearClinicId();
      this.assignCaseState.clearCase();
        this.router.navigate(['/dashboard/appointments'],{
          queryParams: {date: this.appointmentDate}
        });
    },
    error: (err) => {
      this.snackBar.open(err.message, 'Close', {
        duration: 3000,
      });
    },
  });
}


isSelectedSlot(slot: any, dateKey: unknown): boolean {
  return (
    this.selectedSlot === slot &&
    this.selectedDate === String(dateKey)
  );
}
editStatusCase(){
  const payload = {
    status: 'completed'
  };
  const caseId = this.caseId ?? this.appointmentId;
  this._AppointmentsService.editCase(caseId,payload).subscribe({
    next: (res) => {
      this.closeNextVisitModal();
       this.startCaseState.clearStartCaseData();
      this.startCaseState.clearClinicId();
      this.assignCaseState.clearCase();
        this.router.navigate(['/dashboard/appointments'],{
          queryParams: {date: this.appointmentDate}
        });
    },
    error: (err) => {
      this.snackBar.open(err.message, 'Close', {
        duration: 3000,
      });
    },
  });
}
  // ngOnDestroy() {
  //   this.startCaseState.clearStartCaseData();
  //   this.startCaseState.clearClinicId();
  //   this.assignCaseState.clearCase();
  // }
}
