import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../shared/search/search.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { PatientService } from '../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  injectMutation,
  injectQuery,
  QueryClient
} from '@tanstack/angular-query-experimental'
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule,
    TranslateModule,
    MatIconModule,
    SearchComponent,
    PaginationComponent,
    ModalComponent, 
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent {

  CurrentPage = signal(1);
  limit = signal(10);
  searchNameValue = ''; 
  searchName = signal('');
  patientData:any[] = [];
  totalData = 0 ;
  isAddPatientModalOpen = false;
  showPassword = false;
  addPatientForm!:any;

  constructor(
    private _Router:Router, 
    private _PatientService:PatientService,
    private _MatSnackBar: MatSnackBar,private fb: FormBuilder,){
      this.addPatientForm = this.fb.group({
      name: [''],
      email: [''],
      phone_number: [''],
      password: [''],
      age: [''],
      gender: [''],
    });
    }

    

  // ⚙️ Computed params (auto-update when signals change)
  params = computed(() => ({
    page: this.CurrentPage(),
    limit: this.limit(),
    ...(this.searchName().trim() && { search: this.searchName().trim() }),
  }));

  patientsQuery = injectQuery(() => ({
  queryKey: ['patients'], // ✅ shared key for caching
  queryFn: () => this._PatientService.getPatients(this.params()),
  throwError: (err:any) => {
    this._MatSnackBar.open(err.error.message, 'Close', {
      duration:3000,
      panelClass:['snackbar-error']
    });
  },
}));

  // 🧩 Getters for easier template use
  get isLoading() {
    return this.patientsQuery.isLoading();
  }
  get isError() {
    return this.patientsQuery.isError();
  }
  get patients() {
    return this.patientsQuery.data()?.data || [];
  }
  get total() {
    return this.patientsQuery.data()?.total || 0;
  }

//   getPatients() {
//   const params: any = {
//     page: this.CurrentPage,
//     limit: this.limit,
//   };

//   // ✅ Only add search if it's not empty
//   if (this.searchName && this.searchName.trim() !== '') {
//     params.search = this.searchName.trim();
//   }

//   this._PatientService.getPatients(params).subscribe({
//     next: (response) => {
//       console.log('Patients response', response);
//       this.patientData = response.data || [];
//       this.totalData = response.total || 0;
//     },
//     error: (err) => {
//       this._MatSnackBar.open(err.error.message || 'Failed to fetch', 'Close', {
//       duration: 3000,
//       panelClass: ['snackbar-error']
//     });
//     }
//   });
// }


  onSearch(){
    this.CurrentPage.set(1);
    this.searchName.set(this.searchNameValue);
    this.patientsQuery.refetch();
  }
  onPageChange(page:number){
    this.CurrentPage.set(page);
    this.patientsQuery.refetch();
  }

  goToDetails(patient:any) {
  // this._PatientService.setSelectedPatient(patient); // store full patient data
  this._Router.navigate([`/dashboard/patients/${patient.id}`]);
  }

  openAddPatient(){
    this.isAddPatientModalOpen = true;
  }

  closeAddPatient(){
    this.isAddPatientModalOpen = false;
  }

}
