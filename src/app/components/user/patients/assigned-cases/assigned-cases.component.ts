import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../shared/search/search.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
