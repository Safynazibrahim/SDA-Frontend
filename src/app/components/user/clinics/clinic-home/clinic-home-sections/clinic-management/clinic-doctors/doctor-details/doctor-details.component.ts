import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ClinicService } from '../../../../../clinic.service';
import {
  Theme,
  ThemeService,
} from '../../../../../../../core/services/theme.service';
import { ModalComponent } from '../../../../../../../shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [TranslateModule, RouterModule, MatIconModule , ModalComponent , CommonModule , FormsModule],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.scss',
})
export class DoctorDetailsComponent implements OnInit {
  clinicId: string | null = null;
  doctorId: string | null = null;
  doctorDetails: any = null;
  theme: Theme = 'light';
  dayNames: { [key: string]: string } = {
    '0': 'Saturday',
    '1': 'Sunday',
    '2': 'Monday',
    '3': 'Tuesday',
    '4': 'Wednesday',
    '5': 'Thursday',
    '6': 'Friday',
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

// نفس الفورم
scheduleForm: { [key: number]: any[] } = {};
isOwner: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private clinicService: ClinicService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((theme) => {
      this.theme = theme;
      console.log('Current theme in DoctorDetailsComponent:', this.theme);
    });
    this.doctorId = this.route.snapshot.paramMap.get('id');
    this.clinicId = this.route.snapshot.queryParamMap.get('clinicId');
    this.isOwner = this.route.snapshot.queryParamMap.get('isOwner') === 'true';
    console.log('Doctor ID:', this.doctorId);
    console.log('Clinic ID:', this.clinicId);
    console.log('isOwner:', this.isOwner);

    if (this.doctorId) {
      this.getDoctorDetails(this.doctorId);
    }
  }
  formattedSchedule: {
    dayKey: string;
    dayName: string;
    slots: { startTime: string; endTime: string }[];
  }[] = [];

  getDoctorDetails(doctorId: string) {
    if (this.clinicId) {
      this.clinicService
        .getDoctorById(this.clinicId, doctorId)
        .subscribe((doctorDetails) => {
          this.doctorDetails = doctorDetails;

          const schedule = doctorDetails.schedule;

          this.formattedSchedule = Object.keys(schedule).map((dayKey) => {
            return {
              dayKey,
              dayName: this.dayNames[dayKey],
              slots: schedule[dayKey],
            };
          });

          console.log('Formatted Schedule:', this.formattedSchedule);
        });
    }
  }
  openScheduleFromDetails() {
  this.selectedDoctor = this.doctorDetails;
  this.isScheduleOpen = true;

  this.scheduleForm = {};

  this.days.forEach(day => {
    this.scheduleForm[day.id] =
      this.doctorDetails.schedule?.[day.id]
        ? this.doctorDetails.schedule[day.id].map((s: any) => ({
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

removeTime(dayId: number, index: number) {
  if (this.scheduleForm[dayId].length > 1) {
    this.scheduleForm[dayId].splice(index, 1);
  }
}

validateTime(dayId: number, index: number) {
  const slot = this.scheduleForm[dayId][index];
  if (!slot.startTime || !slot.endTime) {
    slot.hasError = false;
    return;
  }
  slot.hasError = slot.endTime < slot.startTime;
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
    doctorId: this.doctorId,
    schedules
  };

  this.clinicService.setSchedule(payload).subscribe({
    next: () => {
      this.closeSchedule();
      this.getDoctorDetails(this.doctorId!); // refresh details
    },
    error: err => console.error(err)
  });
}

closeSchedule() {
  this.isScheduleOpen = false;
  this.selectedDoctor = null;
}

}
