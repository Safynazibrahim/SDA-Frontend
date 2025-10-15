import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-generate-ai',
  standalone: true,
  imports: [RouterLink, RouterModule, TranslateModule, CommonModule, MatIcon],
  templateUrl: './generate-ai.component.html',
  styleUrl: './generate-ai.component.scss'
})
export class GenerateAIComponent implements OnInit {
  treatmentProgress = 72; 
  progressOffset: string = '';

  medications = [
    {
      name: 'Medication Name',
      dosage: '400mg',
      duration: '3 day',
      frequency: 'For 7day',
      status: 'Safe',
      statusClass: 'status-safe'
    },
    {
      name: 'Medication Name',
      dosage: '400mg',
      duration: '3 day',
      frequency: 'For 7day',
      status: 'Conflict',
      statusClass: 'status-conflict'
    },
    {
      name: 'Medication Name',
      dosage: '400mg',
      duration: '3 day',
      frequency: 'For 7day',
      status: 'Safe',
      statusClass: 'status-safe'
    }
  ];

  treatmentPlan = [
    { session: 'Session 1', treatment: 'Filling' },
    { session: 'Session 2', treatment: 'Root Canal' },
    { session: 'Session 3', treatment: 'Crown fitting' }
  ];

  instructions = [
    'Avoid chewing on the left side',
    'Avoid chewing on the left side'
  ];

  ngOnInit() {
    this.calculateProgress();
  }

  calculateProgress() {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (this.treatmentProgress / 100) * circumference;
    this.progressOffset = offset.toString();
  }
}