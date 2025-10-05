import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SearchComponent } from '../../../../../shared/search/search.component';
import { ClinicService } from '../../../clinic.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, TranslateModule, SearchComponent, MatIcon],
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

  constructor(
    private route: ActivatedRoute,
    private clinicService: ClinicService
  ) {
    this.generateWeek(this.currentDate);
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params) => {
      this.clinicId = params.get('id');
      console.log('clinicId in appointments', this.clinicId);
      this.fetchAppointments();
    });
  }

  // ✅ جلب المواعيد سواء بعيادة أو كل العيادات
  fetchAppointments() {
    const dateStr = this.currentDate.toISOString().split('T')[0];

    if (this.clinicId) {
      this.clinicService.getAppointmentForClinic(this.clinicId, dateStr).subscribe({
        next: (res) => this.mapAppointments(res),
        error: (err) => console.error('Error fetching clinic appointments', err),
      });
    } else {
      this.clinicService.getAllAppointments(dateStr).subscribe({
        next: (res) => this.mapAppointments(res),
        error: (err) => console.error('Error fetching all appointments', err),
      });
    }
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
        isAssigned: a?.isAssigned || false, // ✅ هنستخدمها لتحديد الـ view
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

  // ✅ يقبل 03:30 أو 3:30
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

  // ✅ لحساب مكان الكارت داخل الجدول
  getAppointmentTop(appt: any): number {
    const startOfDayMinutes = 8 * 60;
    return appt.startMinutes - startOfDayMinutes;
  }

  getAppointmentHeight(appt: any): number {
    return appt.durationMinutes;
  }

  // ✅ لما المستخدم يضغط على كارت Appointment
  openDetails(appt: any) {
    this.selectedAppointment = appt;
  }

  // ✅ لإغلاق الـ Sidebar
  closeDetails() {
    this.selectedAppointment = null;
  }

  onSearch() {
    console.log('Searching...');
  }
}
