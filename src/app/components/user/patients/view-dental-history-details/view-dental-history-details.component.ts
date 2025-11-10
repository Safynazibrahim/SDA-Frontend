import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PatientService } from '../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-dental-history-details',
  standalone: true,
  imports: [TranslateModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './view-dental-history-details.component.html',
  styleUrl: '../../patients/patient-list/patient-profile/patient-profile/patient-profile-sections/dental-history/dental-history.component.scss'
})
export class ViewDentalHistoryDetailsComponent implements OnInit{

  patientId!: string;
  caseId!: string;

  constructor(private _ActivatedRoute: ActivatedRoute, 
    private _Router: Router,
    private _PatientService: PatientService,
    private _MatSnackBar: MatSnackBar
    ) {
    
  }
  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.patientId = params['patientId'];
    });
    this._ActivatedRoute.paramMap.subscribe(params => {
      this.caseId = params.get('caseId')!;
    });
    console.log(this.patientId)
    console.log(this.caseId)
  }
  cases = { id: 1, diagnosis: 'Start root canal treatment', complete: 70 };

  caseDetailsQuery = injectQuery(() => ({
    queryKey: ['case-details', this.caseId],
    queryFn: () => this._PatientService.getCasesDetails(this.caseId),
    enabled: !!this.caseId, // ✅ prevent fetch before caseId is set
    throwError: (err: any) => {
      this._MatSnackBar.open(err.error.message, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    },
  }));

  // ✅ Template accessors
  get caseDetails() {
    return this.caseDetailsQuery.data() || null;
  }

  goBack() {
    this._Router.navigate([`/dashboard/patients/${this.patientId}/dental-history`]);
  }

}
