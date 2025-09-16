import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateCompiler, TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-clinic-inventory-section',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    PaginationComponent, 
    MatIconModule,
    MatMenuModule,
    MatButtonModule,],
  templateUrl: './clinic-inventory-section.component.html',
  styleUrl: './clinic-inventory-section.component.scss'
})
export class ClinicInventorySectionComponent {

  selectedStatus:any;
  CurrentPage=1

  changeStatus(status:any){
  this.selectedStatus = status; 
  }
  onPageChange(page: number) {
    this.CurrentPage = page;
    
  }
}
