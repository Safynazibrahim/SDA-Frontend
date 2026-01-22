import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../../../shared/search/search.component';
import { ClinicService } from '../../../clinic.service';
import { StartCaseStateService } from '../../../../appointments/start-case/start-case-state.service';
import { PatientService } from '../../../../patients/patient.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, TranslateModule, SearchComponent, MatIcon , RouterLink , MatTooltipModule],
  templateUrl: './clinic-appiontments-section.component.html',
  styleUrl: './clinic-appiontments-section.component.scss',
})
export class ClinicAppiontmentsSectionComponent implements OnInit {
  currentDate = new Date();
  today = new Date();
  weekDays: { label: string; date: Date }[] = [];
  clinicId: string | null = null;
  appointments: any[] = [];
  timeSlots = Array(10).fill(0);
  selectedAppointment: any = null; // ✅ علشان نعرض الـ Sidebar لما المستخدم يضغط
  fromPage: 'navbar' | 'clinic' = 'navbar';
  startOfDayHour: any;

  constructor(
    private route: ActivatedRoute,
    private clinicService: ClinicService,
    private router : Router,
    private startCaseState: StartCaseStateService,
    private _PatientService: PatientService, 
  ) {
    this.generateWeek(this.currentDate);
  }

  // ngOnInit(): void {
  //  this.route.parent?.paramMap.subscribe((params) => {
  //   this.clinicId = params.get('id');
  //   this.fromPage = this.clinicId ? 'clinic' : 'navbar';
  //   console.log('🦷 clinicId in appointments:', this.clinicId);
  //   console.log('📍 fromPage detected as:', this.fromPage);
  //   this.fetchAppointments();
  // });
  //   this.route.parent?.paramMap.subscribe((params) => {
  //     this.clinicId = params.get('id');
  //     console.log('clinicId in appointments', this.clinicId);
  //     this.fetchAppointments();
  //   });
  // }
  ngOnInit(): void {
  // 🟢 1. اقرأ التاريخ من الـ URL (لو موجود)
  this.route.queryParams.subscribe((params) => {
    const dateParam = params['date'];
    if (dateParam) {
      this.currentDate = new Date(dateParam);
      console.log('📅 Restored date from URL:', this.currentDate);
    }
  });

  // 🟢 2. اشترك مرة واحدة في parent paramMap
  this.route.parent?.paramMap.subscribe((params) => {
    this.clinicId = params.get('id');
    this.fromPage = this.clinicId ? 'clinic' : 'navbar';
    console.log('🦷 clinicId in appointments:', this.clinicId);
    console.log('📍 fromPage detected as:', this.fromPage);

    this.generateWeek(this.currentDate);
    this.fetchAppointments();
  });
}


  // ✅ جلب المواعيد سواء بعيادة أو كل العيادات
 // ✅ تحديث fetchAppointments
fetchAppointments() {
  const dateStr = this.currentDate.toISOString().split('T')[0];

  const handleResponse = (res: any[]) => {
    this.mapAppointments(res);
    this.generateDynamicTimeSlots(); // 🆕 توليد الوقت بعد تحميل المواعيد
  };

  if (this.clinicId) {
    this.clinicService.getAppointmentForClinic(this.clinicId, dateStr).subscribe({
      next: handleResponse,
      error: (err) => console.error('Error fetching clinic appointments', err),
    });
  } else {
    this.clinicService.getAllAppointments(dateStr).subscribe({
      next: handleResponse,
      error: (err) => console.error('Error fetching all appointments', err),
    });
  }
}

// 🆕 دالة لتوليد الوقت الديناميكي
generateDynamicTimeSlots() {
  if (!this.appointments.length) {
    this.timeSlots = [];
    return;
  }

  // الحصول على أقل startTime وأعلى endTime
  const startTimes = this.appointments.map(a => this.parseTime(a.startTime).hour);
  const endTimes = this.appointments.map(a => this.parseTime(a.endTime).hour);

  let minHour = Math.min(...startTimes);
  let maxHour = Math.max(...endTimes);
  this.startOfDayHour = minHour;

  const slots: string[] = [];
  for (let h = minHour; h <= maxHour; h++) {
    const label = this.formatHour(h);
    slots.push(label);
  }

  this.timeSlots = slots;
  console.log('🕒 Generated time slots:', this.timeSlots);
}

// 🧠 تحويل الساعة إلى صيغة AM / PM
formatHour(hour: number): string {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display} ${suffix}`;
}


  // ✅ تحويل الداتا لشكل موحد + إضافة isAssigned
  private mapAppointments(res: any[]) {
    console.log('Appointments response', res);

    this.appointments = res.map((a: any) => {
      const start = this.parseTime(a.startTime);
      const end = this.parseTime(a.endTime);
      return {
        id: a.id,
        name: a?.clinicName || a?.clinic?.name,
        time: `${a.startTime} - ${a.endTime}`,
        patient: a?.patient,
        clinic: a?.clinic,
        isAssigned: a?.caseId!=null,
        caseId: a?.caseId,       
        case: a?.case,
        startMinutes: start.totalMinutes,
        endMinutes: end.totalMinutes,
        durationMinutes: end.totalMinutes - start.totalMinutes,
        status: a.status,
        date: a.date,
        startTime: a.startTime,
        endTime: a.endTime,
      };
    });
  }

  parseTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    const hour = h;
    const minutes = m || 0;
    return {
      hour,
      totalMinutes: hour * 60 + minutes,
    };
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
  this.currentDate = newDate;
  this.generateWeek(this.currentDate);
  this.fetchAppointments();

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { date: newDate.toISOString() },
    queryParamsHandling: 'merge',
  });
}


selectDay(day: Date) {
  this.currentDate = day;
  this.generateWeek(day);
  this.fetchAppointments();

  // 🟢 ضيفي ده لتحديث الـ URL بدون إعادة تحميل
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { date: day.toISOString() },
    queryParamsHandling: 'merge', // يحافظ على باقي الـ params
  });
}


  isSelected(day: Date): boolean {
    return (
      day.getDate() === this.currentDate.getDate() &&
      day.getMonth() === this.currentDate.getMonth() &&
      day.getFullYear() === this.currentDate.getFullYear()
    );
  }

  // ✅ لحساب مكان الكارت داخل الجدول
  getAppointmentTop(appt: any): number {
  // بدل ما تكون ثابتة على 8 ساعات، استخدم أول ساعة ديناميكية
  const startOfDayMinutes = this.startOfDayHour * 60;
  return appt.startMinutes - startOfDayMinutes;
}


  getAppointmentHeight(appt: any): number {
    return appt.durationMinutes;
  }

  // ✅ لما المستخدم يضغط على كارت Appointment
  openDetails(appt: any) {
    this.selectedAppointment = appt;
     console.log('🩺 Selected Appointment:', appt);
  }

  // ✅ لإغلاق الـ Sidebar
  closeDetails() {
    this.selectedAppointment = null;
  }

  onSearch() {
    console.log('Searching...');
  }
  maskPatientId(id: string | number | null): string {
  if (!id) return '-';
  const idStr = String(id);
  const last3 = idStr.slice(-3); 
  const masked = '*'.repeat(Math.max(idStr.length - 3, 0)) + last3;
  return masked;
}
openStartCase(appt: any) {
  if (!appt) return;

  this.startCaseState.setClinicId(appt.clinic?.id);
  console.log('🏥 Saved clinicId:', appt.clinic?.id);

  this.router.navigate(
    ['/dashboard/appointments/assign-case', appt.id],
    {
      queryParams: {
        from: 'appointmentsStartCase',
        date: this.currentDate.toISOString(),
        patientName: appt.patient?.user?.fullName,
        gender: appt.patient?.gender || '-',
        age: appt.patient?.age || '-',
        appointmentDate: appt.date,
        startTime: appt.startTime,
        endTime: appt.endTime
      }
    }
  );
}

goToPatientProfile(selectedAppointment: any) {
    if (selectedAppointment?.patient) {
      this._PatientService.setSelectedPatient(selectedAppointment.patient);
      this.router.navigate(['/dashboard/patients', selectedAppointment.patient.id]);
    }
  }
}

