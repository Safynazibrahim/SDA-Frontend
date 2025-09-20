import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClinicService } from '../../../clinic.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './clinic-appiontments-section.component.html',
  styleUrl: './clinic-appiontments-section.component.scss',
})
export class ClinicAppiontmentsSectionComponent implements OnInit {
  currentDate = new Date();
  today = new Date();
  weekDays: { label: string; date: Date }[] = [];
  clinicId!: string;
  appointments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private appointmentService: ClinicService
  ) {
    this.generateWeek(this.currentDate);
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.clinicId = params.get('id')!;
      console.log('clinicId in appointments', this.clinicId);

      this.fetchAppointments();
    });
  }

  fetchAppointments() {
    const dateStr = this.currentDate.toISOString().split('T')[0]; 
    this.appointmentService
      .getAppointmentForClinic(this.clinicId, dateStr)
      .subscribe({
        next: (res) => {
          console.log('Appointments response', res);
          this.appointments = res?.appointments || [];
        },
        error: (err) => {
          console.error('Error fetching appointments', err);
        },
      });
  }

  generateWeek(baseDate: Date) {
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

    this.weekDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d,
      };
    });
  }

  changeWeek(direction: number) {
    const newDate = new Date(this.currentDate);
    newDate.setDate(this.currentDate.getDate() + direction * 7);

    if (direction === -1 && newDate < this.today) return;

    this.currentDate = newDate;
    this.generateWeek(this.currentDate);
    this.fetchAppointments();
  }

  selectDay(day: Date) {
    this.currentDate = day;
    this.generateWeek(day);
    this.fetchAppointments();
  }

  isSelected(day: Date): boolean {
    return (
      day.getDate() === this.currentDate.getDate() &&
      day.getMonth() === this.currentDate.getMonth() &&
      day.getFullYear() === this.currentDate.getFullYear()
    );
  }
}
