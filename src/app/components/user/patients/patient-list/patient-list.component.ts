import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../shared/search/search.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { PatientService } from '../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, 
    TranslateModule, 
    MatIconModule, 
    SearchComponent,
    PaginationComponent,
    ModalComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit{

  CurrentPage =1;
  limit = 10;
  searchName = '';
  patientData:any[] = [];
  totalData = 0 ;
  isAddPatientModalOpen = false;
  showPassword = false;

  constructor(
    private _Router:Router, 
    private _PatientService:PatientService,
    private _MatSnackBar: MatSnackBar,){}

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients() {
  const params: any = {
    page: this.CurrentPage,
    limit: this.limit,
  };

  // ✅ Only add search if it's not empty
  if (this.searchName && this.searchName.trim() !== '') {
    params.search = this.searchName.trim();
  }

  this._PatientService.getPatients(params).subscribe({
    next: (response) => {
      console.log('Patients response', response);
      this.patientData = response.data || [];
      this.totalData = response.total || 0;
    },
    error: (err) => {
      this._MatSnackBar.open(err.error.message || 'Failed to fetch', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error']
    });
    }
  });
}


  onSearch(){
    this.CurrentPage = 1;
    this.getPatients();
  }
  onPageChange(page:number){
    this.CurrentPage = page;
    this.getPatients();
  }

  goToDetails(patient:any) {
  this._PatientService.setSelectedPatient(patient); // store full patient data
  this._Router.navigate([`/dashboard/patients/${patient.id}`]);
  }

  openAddPatient(){
    this.isAddPatientModalOpen = true;
  }

  closeAddPatient(){
    this.isAddPatientModalOpen = false;
  }

}
