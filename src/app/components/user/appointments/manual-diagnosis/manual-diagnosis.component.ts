import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
  ],
  templateUrl: './manual-diagnosis.component.html',
  styleUrl: './manual-diagnosis.component.scss',
})
export class ManualDiagnosisComponent {
  diagnosisName = '';
  treatmentPlan = '';
  instructionBetweenVisits = '';

  // dropdown control
  isDropdownOpen = false;
  openIndex: number | null = null;
  selectedMedication = '';

  medications = [
    { name: 'Medicine Name', dosage: '', frequency: '', duration: '', safe: true },
    { name: 'Medicine Name', dosage: '', frequency: '', duration: '', safe: true },
    { name: 'Medicine Name', dosage: '', frequency: '', duration: '', safe: true },
    { name: 'Medicine Name', dosage: '', frequency: '', duration: '', safe: true },
  ];

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.openIndex = null; // reset any open section when closing
  }

  toggleMed(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
