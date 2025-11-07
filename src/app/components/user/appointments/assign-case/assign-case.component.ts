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

  // selected values
  selectedInvestigations: string[] = [];
  selectedMedications: string[] = [];
  selectedDiseases: string[] = [];
searchDiseaseTerm = ''; // للسيرش في الأمراض

  // dropdown control
  pageTitle = '';

  openDropdown: string | null = null;
  searchTerm = '';
appointmentId: string | null = null;
  constructor(private _AppointmentsService: AppointmentsService , private route: ActivatedRoute , private router: Router , private caseState: CaseStateService) {}
 ngOnInit(): void {
  this.appointmentId = this.route.snapshot.paramMap.get('id');
  const from = this.route.snapshot.queryParamMap.get('from');

  if (from === 'appointmentsStartCase') {
    this.pageTitle = 'Start Case';
  } else if (from === 'appointmentsAssignCase') {
    this.pageTitle = 'Assign Case';
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
      appointmentId : this.appointmentId,
      chiefComplaint: this.chiefComplaint,
      // medications: this.selectedMedications,
      // diseases: this.selectedDiseases
    };
    this._AppointmentsService.assignCase(caseData).subscribe({
      next: (res) => {
        console.log('Case assigned successfully', res);
        this.caseState.setCaseId(res.caseId);
      this.caseState.setCaseData({
        caseId: res.caseId,
        appointmentId: this.appointmentId!,
        chiefComplaint: this.chiefComplaint
      });
        if(this.pageTitle === 'Assign Case'){
          this.router.navigate(['/dashboard/appointments']);
        }
        else{
          this.router.navigate(['/dashboard/appointments/start-case', this.appointmentId]);
        }
      },
      error: (err) => {
        console.error('Error assigning case', err);
      }
    });
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

}
