import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './clinic-appiontments-section.component.html',
  styleUrl: './clinic-appiontments-section.component.scss'
})
export class ClinicAppiontmentsSectionComponent {
  currentDate = new Date(); // يبدأ بالنهارده
  today = new Date(); // نخزن النهارده هنا
  weekDays: { label: string; date: Date }[] = [];

  constructor() {
    this.generateWeek(this.currentDate);
  }

  generateWeek(baseDate: Date) {
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

    this.weekDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d
      };
    });
  }

  changeWeek(direction: number) {
    const newDate = new Date(this.currentDate);
    newDate.setDate(this.currentDate.getDate() + direction * 7);

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
appointments = [
  { name: 'Clinic name', time: '9:00 AM - 10:00 AM', row: 2 },
  { name: 'Clinic name', time: '11:00 AM - 12:00 PM', row: 4 },
  { name: 'Clinic name', time: '1:00 PM - 2:00 PM', row: 6 },
  { name: 'Clinic name', time: '3:00 PM - 4:00 PM', row: 8 }
];

}
