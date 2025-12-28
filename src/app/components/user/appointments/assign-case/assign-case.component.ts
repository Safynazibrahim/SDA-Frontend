import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentsService } from '../appointments.service';
import { ActivatedRoute, RouterLink ,Router } from '@angular/router';
import { CaseStateService } from './case-state.service';
@Component({
  selector: 'app-assign-case',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './assign-case.component.html',
  styleUrl: './assign-case.component.scss',
})
export class AssignCaseComponent implements OnInit , OnDestroy{
  chiefComplaint = '';

  // dropdown lists
  clinicalInvestigations: string[] = ['X-Ray', 'Blood Test', 'MRI'];
  medications: string[] = [
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Metformin",
  "Amlodipine",
  "Omeprazole",
  "Atorvastatin",
  "Losartan",
  "Azithromycin",
  "Cetirizine",
];;
  diseases: string[] = ["Diabetes", "Hypertension", "Asthma"];
  appointmentDate:any
  // selected values
  selectedInvestigations: string[] = [];
  selectedMedications: string[] = [];
  selectedDiseases: string[] = [];
searchDiseaseTerm = ''; // للسيرش في الأمراض
clinicId: string | null = null; // ضيفي ده في بداية الكلاس
from: string | null = null;
  // dropdown control
  pageTitle = '';

  openDropdown: string | null = null;
  searchTerm = '';
appointmentId: string | null = null;
patientName = '';
gender = '';
age: string | null = '';
startTime = '';
endTime = '';

  constructor(private _AppointmentsService: AppointmentsService , private route: ActivatedRoute , private router: Router , private caseState: CaseStateService) {}
 ngOnInit(): void {
  const query = this.route.snapshot.queryParamMap;
  this.appointmentId = this.route.snapshot.paramMap.get('id');
  this.from = query.get('from');
  this.appointmentDate = query.get('date');
this.patientName = query.get('patientName') || '';
  this.gender = query.get('gender') || '';
  this.age = query.get('age') || '';
  this.startTime = query.get('startTime') || '';
  this.endTime = query.get('endTime') || '';
  if (this.from === 'appointmentsStartCase') {
    this.pageTitle = 'Start Case';
  } else if (this.from === 'appointmentsAssignCase') {
    this.pageTitle = 'Assign Case';
  }else if(this.from === 'appointmentsEditAssignCase' || this.from === 'appointmentsEditAssignCaseClinic'){
    this.pageTitle = 'Edit Case'
    this.loadCaseData();
  }
  const storedCase = this.caseState.getCaseData();
  if (storedCase && storedCase.appointmentId === this.appointmentId) {
    console.log('♻️ Restored case from state:', storedCase);
    this.chiefComplaint = storedCase.chiefComplaint || '';
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }
}


  toggleDropdown(type: string) {
    this.openDropdown = this.openDropdown === type ? null : type;
  }

  toggleSelection(value: string, type: string, event: any) {
    let targetArray: string[];

    if (type === 'investigation') targetArray = this.selectedInvestigations;
    else if (type === 'medication') targetArray = this.selectedMedications;
    else targetArray = this.selectedDiseases;

    if (event.target.checked) {
      targetArray.push(value);
    } else {
      const index = targetArray.indexOf(value);
      if (index > -1) targetArray.splice(index, 1);
    }
  }

  filteredMedications() {
    return this.medications.filter(m =>
      m.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  filteredDiseases() {
  if (!this.searchDiseaseTerm.trim()) return this.diseases;
  const term = this.searchDiseaseTerm.toLowerCase();
  return this.diseases.filter(d => d.toLowerCase().includes(term));
}

  toggleLabelSelection(value: string, type: string) {
  let targetArray: string[];

  if (type === 'investigation') targetArray = this.selectedInvestigations;
  else if (type === 'medication') targetArray = this.selectedMedications;
  else targetArray = this.selectedDiseases;

  const index = targetArray.indexOf(value);

  if (index > -1) {
    targetArray.splice(index, 1);
  } else {
    targetArray.push(value); 
  }
}

 saveCase() {
  const caseData = {
    appointmentId: this.appointmentId,
    initialChiefComplaint: this.chiefComplaint,
    // medications: this.selectedMedications,
    // diseases: this.selectedDiseases,
    // clinicalInvestigations: this.selectedInvestigations
  };
  

  // 🟢 لو صفحة عرض حالة قديمة (تعديل)
  if (this.pageTitle === 'Edit Case') {
    this._AppointmentsService.editCase(this.appointmentId!, caseData).subscribe({
      next: (res) => {
          this.caseState.setCaseData({
          chiefComplaint: this.chiefComplaint
        });
        console.log('✅ Case updated successfully', res);
         this.router.navigate(['/dashboard/appointments/start-case', this.appointmentId], {
          queryParams: { date: this.appointmentDate, from: 'appointments' }
        });
      },
      error: (err) => console.error('❌ Error updating case', err)
    });
  }
  // 🟢 لو صفحة جديدة (إنشاء)
  else {
    this._AppointmentsService.assignCase(caseData).subscribe({
      next: (res) => {
        console.log('✅ Case assigned successfully', res);
        this.caseState.setCaseId(res.caseId);
        this.caseState.setCaseData({
          caseId: res.caseId,
          appointmentId: this.appointmentId!,
          chiefComplaint: this.chiefComplaint
        });

       if(this.pageTitle === 'Assign Case'){
          this.router.navigate(['/dashboard/appointments'], {
          queryParams: { date: this.appointmentDate }
        });
        }
        else{
          this.router.navigate(
          ['/dashboard/appointments/start-case', this.appointmentId],
          { queryParams: { date: this.appointmentDate, from: 'appointments' } }
        );
        }
      },
      error: (err) => console.error('❌ Error assigning case', err)
    });
  }
}

  handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const dropdowns = document.querySelectorAll('.custom-dropdown');

  let clickedInside = false;

  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(target)) {
      clickedInside = true;
    }
  });

  if (!clickedInside) {
    this.openDropdown = null;
  }
}
ngOnDestroy() {
if (typeof document !== 'undefined') {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }}
  loadCaseData() {
  if (!this.appointmentId) return;

  this._AppointmentsService.getCaseById(this.appointmentId).subscribe({
    next: (res) => {
      console.log('🩺 Case Data Loaded:', res);
      this.chiefComplaint = res?.chiefComplaint || '';
      this.selectedMedications = res?.medications || [];
      this.selectedDiseases = res?.diseases || [];
      this.selectedInvestigations = res?.clinicalInvestigations || [];
       const appointment = res?.appointments[0];
       this.clinicId = appointment.doctorClinic?.clinic?.id || null;
      //  this.caseState.setCaseData({
      //     chiefComplaint: this.chiefComplaint
      //   });
       this.caseState.setClinicId(appointment.doctorClinic?.clinic?.id);

      if (appointment) {
        const patient = appointment.patient?.user;
        this.patientName = patient?.fullName || '-';
        this.gender = patient?.gender || ''; // لو متوفّر
        this.age = patient?.age || '';       // لو متوفّر
        this.appointmentDate = appointment?.date || '';
        this.startTime = appointment?.startTime || '';
        this.endTime = appointment?.endTime || '';
      }
    },
    error: (err) => {
      console.error('❌ Error loading case data', err);
    }
  });
}
cancelAction() {
  if (this.from === 'appointmentsEditAssignCaseClinic') {
    // ✅ لو جاي من كلينيك → روح على assigned-cases مع الـ clinicId
    this.router.navigate([
      '/dashboard/clinics',
      this.clinicId,
      'assigned-cases'
    ]);
  } else {
    // ✅ الافتراضي: يرجع على المواعيد
    this.router.navigate(
      ['/dashboard/appointments'],
      { queryParams: { date: this.appointmentDate, from: 'appointments' } }
    );
  }
}


}
