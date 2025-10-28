import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ClinicService } from '../clinic.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-join-clinic',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, MatIconModule, FormsModule],
  templateUrl: './join-clinic.component.html',
  styleUrl: './join-clinic.component.scss'
})
export class JoinClinicComponent implements OnInit {
  clinics: any[] = [];
  searchText: string = '';
  distance = 20;

  constructor(private clinicService: ClinicService) {}
  ngOnInit() {
    this.searchClinics();
  }
  async searchClinics() {
    // الحصول على الموقع الحالي للمستخدم
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const params = {
            name: this.searchText || '',
            lat,
            lng,
            distanceInKm: this.distance
          };

          try {
            const res = await this.clinicService.getAvailableClinics(params).toPromise();
            this.clinics = res;
          } catch (error) {
            console.error('❌ Error fetching clinics', error);
          }
        },
        (error) => {
          console.error('❌ Error getting location', error);
          alert('Please allow location access to find nearby clinics.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
