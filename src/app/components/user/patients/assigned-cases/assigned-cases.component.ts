import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../shared/search/search.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ClinicService } from '../../clinics/clinic.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assigned-cases',
  standalone: true,
  imports: [TranslateModule, MatIcon, RouterLink, SearchComponent,CommonModule,
    MatMenuModule,PaginationComponent
  ],
  templateUrl: './assigned-cases.component.html',
  styleUrl: './assigned-cases.component.scss'
})
export class AssignedCasesComponent implements OnInit{

  clinicId?: any;
  CurrentPage=1;
  limit=10;
  searchName = '';
  assignedCasesData:any[] = [];
  totalData = 0 ;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private _ClinicService:ClinicService,
    private _MatSnackBar:MatSnackBar,
    private _ActivatedRoute: ActivatedRoute,
  ) {
    this.matIconRegistry.addSvgIcon(
      'custom_edit', // 👈 the name you’ll use in the template
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/media/edit-3-svgrepo-com (3) 1.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'custom_view', // 👈 the name you’ll use in the template
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/media/eye-svgrepo-com (4) 1.svg')
    );
  }

  ngOnInit(): void {
    this.clinicId = this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    if(this.clinicId){
      this.getAssignedCasesForClinic();
    }
    else {
      console.log('Assigned cases in nav bar')
    }
  }

  getAssignedCasesForClinic(){
    const params: any = {
    page: this.CurrentPage,
    limit: this.limit,
  };

  // ✅ Only add search if it's not empty
  if (this.searchName && this.searchName.trim() !== '') {
    params.search = this.searchName.trim();
  }

  this._ClinicService.getAssignedCasesForEachClinic(this.clinicId,params).subscribe({
    next: (response) => {
      console.log('assigned cases response', response);
      this.assignedCasesData = response.data || [];
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

  onPageChange(page:number){
    this.CurrentPage = page;
    this.getAssignedCasesForClinic();
  }

  onSearch(){
    this.CurrentPage = 1;
    this.getAssignedCasesForClinic();
  }
  getStatusClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'new':
      return 'new';
    case 'inprogress':
      return 'in-progress';
    case 'completed':
      return 'completed';
    default:
      return '';
  }
}

  openViewModal(){

  }
  openEditModal(){

  }

}
