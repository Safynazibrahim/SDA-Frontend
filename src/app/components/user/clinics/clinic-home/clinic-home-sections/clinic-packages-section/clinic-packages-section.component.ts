import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-clinic-packages-section',
  standalone: true,
  imports: [TranslateModule, MatIconModule, CommonModule, PaginationComponent],
  templateUrl: './clinic-packages-section.component.html',
  styleUrl: './clinic-packages-section.component.scss'
})
export class ClinicPackagesSectionComponent {
CurrentPage = 1;
onPageChange(page: number) {
    this.CurrentPage = page;
    
  }
}
