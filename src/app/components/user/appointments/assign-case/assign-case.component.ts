import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-case',
  standalone: true,
  imports: [MatIconModule, MatButtonModule , TranslateModule , FormsModule, CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,],
  templateUrl: './assign-case.component.html',
  styleUrl: './assign-case.component.scss'
})
export class AssignCaseComponent {
 chiefComplaint = '';
  clinicalInvestigation = '';
  medication = '';
  disease = '';
  diseases: string[] = ['Diabetes', 'Hypertension', 'Asthma'];
  clinicalInvestigations: string[] = ['Diabetes', 'Hypertension', 'Asthma'];
  dropdownOpen = false;
  searchTerm = '';
  selectedMedications: string[] = [];

  medications: string[] = [
    'Panadol',
    'Brufen',
    'Cataflam',
    'Voltaren',
    'Amoxicillin',
    'Paracetamol'
  ];
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  filteredMedications() {
    return this.medications.filter(m =>
      m.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelection(med: string, event: any) {
    if (event.target.checked) {
      this.selectedMedications.push(med);
    } else {
      this.selectedMedications = this.selectedMedications.filter(m => m !== med);
    }
  }
}
