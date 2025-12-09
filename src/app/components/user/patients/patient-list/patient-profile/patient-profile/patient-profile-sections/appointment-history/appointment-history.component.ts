import { Component, computed, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PatientService } from '../../../../../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationComponent } from '../../../../../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [TranslateModule, MatIconModule, CommonModule],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.scss',
})
export class AppointmentHistoryComponent implements OnInit {

  CurrentPage = signal(1);
  limit = signal(100);
  patientId!: any;

  constructor(private _ActivatedRoute: ActivatedRoute,
    private _PatientService:PatientService,
    private _MatSnackBar:MatSnackBar
  ) {}

  params = computed(() =>({
    page: this.CurrentPage(),
    limit: this.limit()
  }) 
  );

  ngOnInit(): void {
    this.patientId = this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
  }

  appointmentHistoryQuery = injectQuery(() => ({
    queryKey:['appointment-hsitory', this.patientId, this.params()],
    queryFn: () => this._PatientService.getPatientAppointmentHistory(this.patientId, this.params()),
    throwError: (err:any) => {
      this._MatSnackBar.open(err.error.message, 'Close', {
        duration: 3000,
        panelClass:'snackbar-error'
      })
    },
  }))

  get patientAppointmentHistory() {
    return this.appointmentHistoryQuery?.data() || [];
  }

  get total() {
    return this.appointmentHistoryQuery?.data()?.total || [];
  }

  onPageChange(page: number){
    this.CurrentPage.set(page);
    this.appointmentHistoryQuery.refetch();
  }
  
}
