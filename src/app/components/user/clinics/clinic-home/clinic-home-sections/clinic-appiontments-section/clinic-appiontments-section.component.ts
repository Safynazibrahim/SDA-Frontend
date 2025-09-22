// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { TranslateModule } from '@ngx-translate/core';
// import { ClinicService } from '../../../clinic.service';

// @Component({
//   selector: 'app-appointments',
//   standalone: true,
//   imports: [CommonModule, TranslateModule],
//   templateUrl: './clinic-appiontments-section.component.html',
//   styleUrl: './clinic-appiontments-section.component.scss',
// })
// export class ClinicAppiontmentsSectionComponent implements OnInit {
//   currentDate = new Date();
//   today = new Date();
//   weekDays: { label: string; date: Date }[] = [];
//   clinicId!: string;
//   appointments: any[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private appointmentService: ClinicService
//   ) {
//     this.generateWeek(this.currentDate);
//   }

//   ngOnInit(): void {
//     this.route.parent?.paramMap.subscribe((params) => {
//       this.clinicId = params.get('id')!;
//       console.log('clinicId in appointments', this.clinicId);

//       this.fetchAppointments();
//     });
//   }

//   fetchAppointments() {
//     const dateStr = this.currentDate.toISOString().split('T')[0]; 
//     this.appointmentService
//       .getAppointmentForClinic(this.clinicId, dateStr)
//       .subscribe({
//         next: (res) => {
//           console.log('Appointments response', res);
//           this.appointments = res?.appointments || [];
//         },
//         error: (err) => {
//           console.error('Error fetching appointments', err);
//         },
//       });
//   }

//   generateWeek(baseDate: Date) {
//     const startOfWeek = new Date(baseDate);
//     startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

//     this.weekDays = Array.from({ length: 7 }).map((_, i) => {
//       const d = new Date(startOfWeek);
//       d.setDate(startOfWeek.getDate() + i);
//       return {
//         label: d.toLocaleDateString('en-US', { weekday: 'short' }),
//         date: d,
//       };
//     });
//   }

//   changeWeek(direction: number) {
//     const newDate = new Date(this.currentDate);
//     newDate.setDate(this.currentDate.getDate() + direction * 7);

//     if (direction === -1 && newDate < this.today) return;

//     this.currentDate = newDate;
//     this.generateWeek(this.currentDate);
//     this.fetchAppointments();
//   }

//   selectDay(day: Date) {
//     this.currentDate = day;
//     this.generateWeek(day);
//     this.fetchAppointments();
//   }

//   isSelected(day: Date): boolean {
//     return (
//       day.getDate() === this.currentDate.getDate() &&
//       day.getMonth() === this.currentDate.getMonth() &&
//       day.getFullYear() === this.currentDate.getFullYear()
//     );
//   }
// }
// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { TranslateModule } from '@ngx-translate/core';
// import { ClinicService } from '../../../clinic.service';

// @Component({
//   selector: 'app-appointments',
//   standalone: true,
//   imports: [CommonModule, TranslateModule],
//   templateUrl: './clinic-appiontments-section.component.html',
//   styleUrl: './clinic-appiontments-section.component.scss',
// })
// export class ClinicAppiontmentsSectionComponent implements OnInit {
//   currentDate = new Date();
//   today = new Date();
//   weekDays: { label: string; date: Date }[] = [];
//   clinicId!: string;
//   appointments: any[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private appointmentService: ClinicService
//   ) {
//     this.generateWeek(this.currentDate);
//   }

//   ngOnInit(): void {
//     this.route.parent?.paramMap.subscribe((params) => {
//       this.clinicId = params.get('id')!;
//       console.log('clinicId in appointments', this.clinicId);

//       this.fetchAppointments();
//     });
//   }

//   fetchAppointments() {
//     const dateStr = this.currentDate.toISOString().split('T')[0]; 
//     this.appointmentService
//       .getAppointmentForClinic(this.clinicId, dateStr)
//       .subscribe({
//         next: (res) => {
//           console.log('Appointments response', res);
//           this.appointments = res?.appointments || [];
//         },
//         error: (err) => {
//           console.error('Error fetching appointments', err);
//         },
//       });
//   }

//   generateWeek(baseDate: Date) {
//     const startOfWeek = new Date(baseDate);
//     startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

//     this.weekDays = Array.from({ length: 7 }).map((_, i) => {
//       const d = new Date(startOfWeek);
//       d.setDate(startOfWeek.getDate() + i);
//       return {
//         label: d.toLocaleDateString('en-US', { weekday: 'short' }),
//         date: d,
//       };
//     });
//   }

//   changeWeek(direction: number) {
//     const newDate = new Date(this.currentDate);
//     newDate.setDate(this.currentDate.getDate() + direction * 7);

//     if (direction === -1 && newDate < this.today) return;

//     this.currentDate = newDate;
//     this.generateWeek(this.currentDate);
//     this.fetchAppointments();
//   }

//   selectDay(day: Date) {
//     this.currentDate = day;
//     this.generateWeek(day);
//     this.fetchAppointments();
//   }

//   isSelected(day: Date): boolean {
//     return (
//       day.getDate() === this.currentDate.getDate() &&
//       day.getMonth() === this.currentDate.getMonth() &&
//       day.getFullYear() === this.currentDate.getFullYear()
//     );
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, TranslateModule , MatIcon],
  templateUrl: './clinic-appiontments-section.component.html',
  styleUrl: './clinic-appiontments-section.component.scss',
})
export class ClinicAppiontmentsSectionComponent implements OnInit {
  currentDate = new Date(); // يبدأ بالنهارده
  today = new Date(); // نخزن النهارده هنا
  weekDays: { label: string; date: Date }[] = [];
  clinicId: string | null = null;

  constructor(private route: ActivatedRoute ) {
    this.generateWeek(this.currentDate);
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.clinicId = params.get('id');
      console.log('clinicId in appointments', this.clinicId);
    });
  }

  generateWeek(baseDate: Date) {
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

    this.weekDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: d,
      };
    });
  }

  changeWeek(direction: number) {
    const newDate = new Date(this.currentDate);
    newDate.setDate(this.currentDate.getDate() + direction * 7);

    // ما نسمحش نرجع قبل النهارده
    if (direction === -1 && newDate < this.today) return;

    this.currentDate = newDate;
    this.generateWeek(this.currentDate);
  }

  selectDay(day: Date) {
    this.currentDate = day;
    this.generateWeek(day);
  }

  isSelected(day: Date): boolean {
    return (
      day.getDate() === this.currentDate.getDate() &&
      day.getMonth() === this.currentDate.getMonth() &&
      day.getFullYear() === this.currentDate.getFullYear()
    );
  }

  // Static data for appointments
  appointments = [
    { 
      name: 'Clinic name', 
      time: '9:00 AM - 10:00 AM', 
      startHour: 9 
    },
    { 
      name: 'Clinic name', 
      time: '11:00 AM - 12:00 PM', 
      startHour: 11 
    },
    { 
      name: 'Clinic name', 
      time: '1:00 PM - 2:00 PM', 
      startHour: 13 
    },
    { 
      name: 'Clinic name', 
      time: '3:00 PM - 4:00 PM', 
      startHour: 15 
    },
  ];

  // Array for grid lines generation
  timeSlots = Array(10).fill(0);

  // Method to calculate appointment position
  getAppointmentTop(appointment: any): number {
    const startIndex = appointment.startHour - 8; // 8 AM is index 0
    return startIndex * 60; // Each time slot is 60px
  }

  // Method to get appointment left position with overlap handling
  getAppointmentLeft(index: number): number {
    return 20 + (index * 30);
  }
}