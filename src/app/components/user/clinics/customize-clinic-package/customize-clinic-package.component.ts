import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Directionality } from '@angular/cdk/bidi';

@Component({
  selector: 'app-customize-clinic-package',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    MatIcon,
    CommonModule,
    FormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSlideToggleModule,
  ],
  templateUrl: './customize-clinic-package.component.html',
  styleUrl: './customize-clinic-package.component.scss',
})
export class CustomizeClinicPackageComponent{

  constructor(private translate: TranslateService,
     private dir: Directionality,
  ) {}
  
  subscriptionMonths: number = 1;
  quickMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  setMonths(m: number) {
    this.subscriptionMonths = m;
  }

  /////////////// fake data for features
  features = [
    {
      key: 'teleconsultation',
      name: 'Secure Teleconsultations',
      description: '30 days / month',
      icon: 'medical_services',
      enabled: false,
      type: 'unlimited', // 'limited'
      limit: 10,
    },
    {
      key: 'patient_messaging',
      name: 'Patient Messaging',
      description: '30 days / month',
      icon: 'chat',
      enabled: false,
      type: 'unlimited',
      limit: 10,
    },
    {
      key: 'teleconsultation',
      name: 'Secure Teleconsultations',
      description: '30 days / month',
      icon: 'medical_services',
      enabled: false,
      type: 'unlimited', // 'limited'
      limit: 10,
    },
    {
      key: 'teleconsultation',
      name: 'Secure Teleconsultations',
      description: '30 days / month',
      icon: 'medical_services',
      enabled: false,
      type: 'unlimited', // 'limited'
      limit: 10,
    },
  ];
  get selectedFeatures() {
    return this.features.filter((f) => f.enabled);
  }

  get selectedFeaturesCount(): number {
    return this.selectedFeatures.length;
  }
}
