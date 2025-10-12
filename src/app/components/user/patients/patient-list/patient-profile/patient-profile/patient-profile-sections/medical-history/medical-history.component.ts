import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './medical-history.component.html',
  styleUrl: './medical-history.component.scss'
})
export class MedicalHistoryComponent {

  selectedTab: 'medications' | 'diseases' = 'medications';

  medications = [
    { name: 'Medication Name' },
    { name: 'Medication Name' },
    { name: 'Medication Name' },
  ];

  diseases = [
    { name: 'Diseases Name' },
    { name: 'Diseases Name' },
    { name: 'Diseases Name' },
  ];


}
