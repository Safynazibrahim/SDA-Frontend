import { routes } from './../../../../../../../../app.routes';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PatientService } from '../../../../../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-dental-history',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dental-history.component.html',
  styleUrl: './dental-history.component.scss',
})
export class DentalHistoryComponent implements OnInit {
  patientId!: any;
  CurrentPage = 1;
  limit = 10;
  filterForm!: FormGroup;
  fromDate!: Date | null;
  toDate!: Date | null;
  patientDentalHistory: any[] = [];

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _PatientService: PatientService,
    private _MatSnackBar: MatSnackBar,
    private _FormBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.patientId = this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    console.log('Child Clinic ID from parent:', this.patientId);
    // Create reactive form
    this.filterForm = this._FormBuilder.group({
      fromDate: [null],
      toDate: [null],
    });

    // Call API initially
    this.getPatientDentalHistory();

    // 👇 Listen to changes and refetch when both dates are selected
    this.filterForm.valueChanges
      .pipe(debounceTime(300)) // waits 300 milliseconds after the last change
      .subscribe((val) => {
        if (val.fromDate && val.toDate) {
          this.getPatientDentalHistory();
        }
      });
  }

  getPatientDentalHistory() {
    const { fromDate, toDate } = this.filterForm.value;

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const params: any = {
    page: this.CurrentPage,
    limit: this.limit,
    from: fromDate ? formatDate(fromDate) : null,
    to: toDate ? formatDate(toDate) : null,
  };
    this._PatientService
      .getPatientDentalHistory(this.patientId, params)
      .subscribe({
        next: (response) => {
          this.patientDentalHistory = response.data || [];
          console.log('Patients in Dental response', this.patientDentalHistory);
          // this.totalData = response.total || 0;
        },
        error: (err) => {
          this._MatSnackBar.open(
            err.error.message || 'Failed to fetch',
            'Close',
            {
              duration: 3000,
              panelClass: ['snackbar-error'],
            }
          );
        },
      });
  }


  goToDetails(caseId: number) {
    this._Router.navigate(
      [`/dashboard/patients/view-dental-history-details/${caseId}`],
      {
        queryParams: { patientId: this.patientId },
      }
    );
  }
}
