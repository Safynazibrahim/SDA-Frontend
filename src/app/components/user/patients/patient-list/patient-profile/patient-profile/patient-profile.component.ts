import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ModalComponent } from '../../../../../shared/modal/modal.component';
import { PatientService } from '../../../patient.service';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [TranslateModule, MatIconModule, RouterLink, RouterOutlet, MatTabsModule,
    CommonModule, RouterModule, ModalComponent
  ],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent implements OnInit{
  patientId!: any;
  patientData: any;
  selectedIndex = 0;
  currentTitle: string = 'appointment_history';
  isEditPatientModalOpen:boolean = false;
  isDeletePatientModalOpen:boolean = false;
  showPassword = false;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private _PatientService:PatientService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild;
        if (child) {
          const routePath = child.snapshot.routeConfig?.path;
          const tab = this.tabs.find(t => t.link === routePath);
          if (tab) {
            this.currentTitle = tab.label;
          }
        }
      });
  }

  ngOnInit(): void {
    // 1️⃣ Get ID from route
    this.route.paramMap.subscribe(params => {
      this.patientId = params.get('id')!;
      console.log('clinicId in parent', this.patientId);
    });

    // 2️⃣ Get patient data from service
    this.patientData = this._PatientService.getSelectedPatient();
    console.log('patient data', this.patientData)

    
  }

  tabs = [
    { label: 'appointment_history', link: 'appointment-history' },
    { label: 'dental_history',      link: 'dental-history' },
    { label: 'dental_chart',        link: 'dental-chart' },
    { label: 'medical_history',     link: 'medical-history' }
  ];


  openEditPatient(){
    this.isEditPatientModalOpen = true;
  }

  closeAddPatient(){
    this.isEditPatientModalOpen = false;
  }

  openDeletePatient(){
    this.isDeletePatientModalOpen = true;
  }

  closeDeletePatient(){
    this.isDeletePatientModalOpen = false;
  }

  goToStartCase() {
    this.router.navigate(['/dashboard/patients/start-case', this.patientId], {
      queryParams: { from: 'patient-profile' },
    });
  }

}   
