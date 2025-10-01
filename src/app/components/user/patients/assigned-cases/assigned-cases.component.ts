import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../shared/search/search.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-assigned-cases',
  standalone: true,
  imports: [TranslateModule, MatIcon, RouterLink, SearchComponent,CommonModule,
    MatMenuModule,PaginationComponent
  ],
  templateUrl: './assigned-cases.component.html',
  styleUrl: './assigned-cases.component.scss'
})
export class AssignedCasesComponent {

  CurrentPage=1;

  onPageChange(page:any){
    
  }

  onSearch(){

  }
  openViewModal(){

  }
  openEditModal(){

  }

}
