import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal, untracked } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PatientService } from '../../../../../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { debounceTime, Subject } from 'rxjs';

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
export class DentalHistoryComponent {
  patientId!: string;
  CurrentPage = signal(1);
  limit = signal(50);

  //signals for date filters
  fromDate = signal<Date | null>(null);
  toDate = signal<Date | null>(null);
  private refetchTrigger$ = new Subject<void>();


  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _PatientService: PatientService,
    private _MatSnackBar: MatSnackBar,
  ) {
    this.refetchTrigger$
    .pipe(debounceTime(300))
    .subscribe(() => {
      
        this.dentalHistoryQuery.refetch();
      
    });

effect(() => {
  const from = this.fromDate();
  const to = this.toDate();
  if (from && to) this.refetchTrigger$.next();
});

this.refetchTrigger$.pipe(debounceTime(300)).subscribe(() => {
  this.dentalHistoryQuery.refetch();
});
 }

  ngOnInit(): void {
    this.patientId = this._ActivatedRoute.parent?.snapshot.paramMap.get('id')!;
    console.log('🦷 Dental history for patient:', this.patientId);
    this.dentalHistoryQuery.refetch(); 
  }

  // ⚙️ Computed params for automatic updates
  params = computed(() => {
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    page: this.CurrentPage(),
    limit: this.limit(),
    from: this.fromDate() ? formatDate(this.fromDate()!) : null,
    to: this.toDate() ? formatDate(this.toDate()!) : null,
  };
});


  // 🧠 Query with automatic caching
  dentalHistoryQuery = injectQuery(() => ({
      queryKey: [
    'dental-history',
    this.patientId,
    this.CurrentPage(),
    // this.fromDate(),
    // this.toDate(),
  ],

    queryFn: () => this._PatientService.getPatientDentalHistory(this.patientId, this.params()),
    throwError: (err:any) => {
      this._MatSnackBar.open(err.error.message, 'Close', {
        duration:3000,
        panelClass:['snackbar-error']
      })
    },
  }));

  // ⚡ Template Getters
  get isLoading() {
    return this.dentalHistoryQuery.isLoading();
  }
  get isError() {
    return this.dentalHistoryQuery.isError();
  }
  get patientDentalHistory() {
    return this.dentalHistoryQuery.data()?.data || [];
  }

  goToDetails(caseId: number) {
    this._Router.navigate(
      [`/dashboard/patients/view-dental-history-details/${caseId}`],
      { queryParams: { patientId: this.patientId } }
    );
  }
}
