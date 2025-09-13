import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-join-clinic',
  standalone: true,
  imports: [CommonModule, TranslateModule , RouterLink , MatIconModule ],
  templateUrl: './join-clinic.component.html',
  styleUrl: './join-clinic.component.scss'
})
export class JoinClinicComponent {
  clinics = [
    { name: 'Clinic Name', address: '123 Oak Street, CA' },
    { name: 'Clinic Name', address: '123 Oak Street, CA' },
    { name: 'Clinic Name', address: '123 Oak Street, CA' },
    { name: 'Clinic Name', address: '123 Oak Street, CA' }
  ];
}
