import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PatientService } from '../../../../../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [TranslateModule, MatIconModule, CommonModule],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss',
})
export class AppointmentHistoryComponent implements OnInit {
  patientId!: any;
  patientAppointmentHistory: any[]=[];

  constructor(private _ActivatedRoute: ActivatedRoute,
    private _PatientService:PatientService,
    private _MatSnackBar:MatSnackBar
  ) {}

  ngOnInit(): void {
    this.patientId = this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    console.log('Child Clinic ID from parent:', this.patientId);
    this.getPatientAppointmentHistory();
  }

  getPatientAppointmentHistory(){
    this._PatientService.getPatientAppointmentHistory(this.patientId).subscribe({
      next: (response) => {
      this.patientAppointmentHistory = response || [];
      console.log('Patients response', this.patientAppointmentHistory);
      // this.totalData = response.total || 0;
    },
    error: (err) => {
      this._MatSnackBar.open(err.error.message || 'Failed to fetch', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    }
    })
  }
}
