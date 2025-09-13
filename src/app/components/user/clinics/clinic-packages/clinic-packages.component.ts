import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-clinic-packages',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './clinic-packages.component.html',
  styleUrls: ['./clinic-packages.component.scss']
})
export class ClinicPackagesComponent {}
