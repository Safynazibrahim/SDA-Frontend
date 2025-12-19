// clinic-doctors.component.ts
import { Component, OnInit } from '@angular/core';
import { ClinicService } from '../../../../clinic.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../../../../shared/search/search.component';
import { MatIcon } from '@angular/material/icon';
import { PaginationComponent } from '../../../../../../shared/pagination/pagination.component';
import { ModalComponent } from '../../../../../../shared/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clinic-doctors',
  standalone: true,
  imports: [CommonModule, TranslateModule, SearchComponent, MatIcon, RouterLink , PaginationComponent , ModalComponent , FormsModule ] ,
  templateUrl: './clinic-doctors.component.html',
  styleUrl: './clinic-doctors.component.scss'
})
export class ClinicDoctorsComponent implements OnInit {
  clinicId: string = ''; 
  page: number = 1;
  limit: number = 10; 
  doctors: any;
  totalDoctors: number = 0;
  dayNames: { [key: string]: string } = {
    '0': 'Saturday',
    '1': 'Sunday',
    '2': 'Monday',
    '3': 'Tuesday',
    '4': 'Wednesday',
    '5': 'Thursday',
    '6': 'Friday'
  };
  isScheduleOpen = false;
selectedDoctor: any = null;
days = [
  { id: 0, name: 'Saturday' },
  { id: 1, name: 'Sunday' },
  { id: 2, name: 'Monday' },
  { id: 3, name: 'Tuesday' },
  { id: 4, name: 'Wednesday' },
  { id: 5, name: 'Thursday' },
  { id: 6, name: 'Friday' }
];

// ده اللي هنشتغل عليه داخل المودال
scheduleForm: { [key: number]: any[] } = {};

  constructor(
    private clinicService: ClinicService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.clinicId = this.route.parent?.parent?.snapshot.paramMap.get('id') || '';
    console.log("DONIA ID: ", this.clinicId);
    this.loadDoctors();
  }

  loadDoctors() {
  if (this.clinicId) {
    this.clinicService
      .getDoctorsForClinic(this.clinicId, this.page, this.limit)
      .subscribe((response: any) => {
        this.doctors = response.data;
        this.totalDoctors = response.total;
      });
  }
}
onPageChange(page: number) {
  this.page = page;
  this.loadDoctors();
}
validateTime(dayId: number, index: number) {
  const slot = this.scheduleForm[dayId][index];

  if (!slot.startTime || !slot.endTime) {
    slot.hasError = false;
    return;
  }

  slot.hasError = slot.endTime < slot.startTime;
}

removeTime(dayId: number, index: number) {
  if (this.scheduleForm[dayId].length > 1) {
    this.scheduleForm[dayId].splice(index, 1);
  }
}


  // فانكشن لاستخراج الأيام والمواعيد من الـ schedule
  getScheduleDays(schedule: any): any[] {
    if (!schedule) return [];
    
    const days: any[] = [];
    
    // نلف على كل يوم في الـ schedule
    Object.keys(schedule).forEach(dayNumber => {
      const slots = schedule[dayNumber];
      
      if (slots && slots.length > 0) {
        slots.forEach((slot: any) => {
          days.push({
            dayNumber: dayNumber,
            startTime: slot.startTime,
            endTime: slot.endTime
          });
        });
      }
    });
    
    return days;
  }

  // فانكشن لتحويل رقم اليوم لاسم اليوم
  getDayName(dayNumber: string): string {
    return this.dayNames[dayNumber] || '';
  }

  onSearch() {
    console.log('Searching...');
  }
  openSchedule(doctor: any) {
  this.selectedDoctor = doctor;
  this.isScheduleOpen = true;

  this.scheduleForm = {};

  this.days.forEach(day => {
    this.scheduleForm[day.id] =
  doctor.schedule?.[day.id]
    ? doctor.schedule[day.id].map((s: any) => ({
        startTime: s.startTime,
        endTime: s.endTime,
        hasError: false
      }))
    : [];

  });
}
isDaySelected(dayId: number): boolean {
  return this.scheduleForm[dayId]?.length > 0;
}
toggleDay(dayId: number) {
  if (this.scheduleForm[dayId].length === 0) {
    this.scheduleForm[dayId].push({
  startTime: '00:00',
  endTime: '00:00',
  hasError: false
});

  } else {
    this.scheduleForm[dayId] = [];
  }
}
addTime(dayId: number) {
  this.scheduleForm[dayId].push({
    startTime: '',
    endTime: '',
    hasError: false
  });
}

hasAnyTimeError(): boolean {
  return Object.values(this.scheduleForm).some(daySlots =>
    daySlots.some(slot => slot.hasError)
  );
}

saveSchedule() {
  if (this.hasAnyTimeError()) return;

  const schedules = Object.keys(this.scheduleForm)
    .map(dayKey => {
      const hours = this.scheduleForm[+dayKey]
        .filter(slot => slot.startTime && slot.endTime)
        .map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime
        }));

      if (hours.length === 0) return null;

      return {
        day: +dayKey,
        hours
      };
    })
    .filter(item => item !== null);

  const payload = {
    clinicId: this.clinicId,
    doctorId: this.selectedDoctor.doctorId,
    schedules
  };

  console.log('FINAL PAYLOAD:', payload);

  this.clinicService.setSchedule(payload).subscribe({
    next: () => {
      this.closesetSchedule();
      this.loadDoctors(); // refresh cards
    },
    error: err => {
      console.error('Schedule error', err);
    }
  });
}

closesetSchedule() {
  this.isScheduleOpen = false;
  this.selectedDoctor = null;
}

}