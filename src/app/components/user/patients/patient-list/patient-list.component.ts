import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../shared/search/search.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, SearchComponent,PaginationComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent {

  constructor(private _Router:Router){}

  CurrentPage =1;
  onSearch(){
    console.log("search work")
  }
  onPageChange(page:any){

  }
  goToDetails(patientId: number) {
  this._Router.navigate([`/dashboard/patients/${patientId}`]);
  }

}
