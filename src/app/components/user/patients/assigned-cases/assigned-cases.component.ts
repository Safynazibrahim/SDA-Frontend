import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { SearchComponent } from '../../../shared/search/search.component';
import { ClinicService } from '../../clinics/clinic.service';
import { PatientService } from '../patient.service';
import {
  injectQuery,
  QueryClient
} from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-assigned-cases',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, PaginationComponent, SearchComponent,RouterLink],
  templateUrl: './assigned-cases.component.html',
  styleUrl: './assigned-cases.component.scss'
})
export class AssignedCasesComponent implements OnInit {

  clinicId?: string | null;
  CurrentPage = signal(1);
  limit = signal(10);
  searchNameValue = '';
  searchName = signal('');

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ClinicService: ClinicService,
    private _PatientService: PatientService,
    private _MatSnackBar: MatSnackBar,
    private route : Router
  ) {}

  ngOnInit(): void {
    this.clinicId = this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
  }

  // ⚙️ computed params for reactive fetching
  params = computed(() => ({
    page: this.CurrentPage(),
    limit: this.limit(),
    ...(this.searchName().trim() && { search: this.searchName().trim() }),
  }));

  // 🧠 dynamic query based on whether we are in a clinic or not
  assignedCasesQuery = injectQuery(() => ({
    queryKey: this.clinicId
      ? ['assignedCases', 'clinic', this.clinicId, this.params()]
      : ['assignedCases', 'all', this.params()],
    queryFn: () =>
      this.clinicId
        ? this._ClinicService.getAssignedCasesForEachClinic(this.clinicId, this.params())
        : this._PatientService.getAllAssignedCases(this.params()),
    throwError: (err:any) => {
    this._MatSnackBar.open(err.error.message, 'Close', {
      duration:3000,
      panelClass:['snackbar-error']
    });
  },
  }));

  // ✅ Getters for template
  get isLoading() {
    return this.assignedCasesQuery.isLoading();
  }

  get isError() {
    return this.assignedCasesQuery.isError();
  }

  get assignedCasesData() {
    return this.assignedCasesQuery.data()?.data || [];
  }

  get totalData() {
    return this.assignedCasesQuery.data()?.total || 0;
  }

  // 🔄 Pagination + Search actions
  onSearch() {
    this.CurrentPage.set(1);
    this.searchName.set(this.searchNameValue);
    this.assignedCasesQuery.refetch();
  }

  onPageChange(page: number) {
    this.CurrentPage.set(page);
    this.assignedCasesQuery.refetch();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'new': return 'new';
      case 'inprogress': return 'in-progress';
      case 'completed': return 'completed';
      default: return '';
    }
  }
   goToAssignCase(caseId: number) {
    this.route.navigate(
      ['/dashboard/appointments/assign-case', caseId],
      {
        queryParams: {
          from: 'appointmentsEditAssignCaseClinic',
        },
      }
    );
  }
  openViewModal(){ } 
  openEditModal(){ }
}
