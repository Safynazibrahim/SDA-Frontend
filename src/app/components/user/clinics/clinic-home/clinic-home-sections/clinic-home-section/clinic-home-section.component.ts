import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-clinic-home-section',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule, 
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    BaseChartDirective,
    PaginationComponent
  ],
  templateUrl: './clinic-home-section.component.html',
  styleUrl: './clinic-home-section.component.scss'
})
export class ClinicHomeSectionComponent {
  clinicId!:  any;
  selectedRange = 'Monthly';
  totalRevenue = '85,000 SAR';
  fromDate!: Date | null;
  toDate!: Date | null;
  CurrentPage = 1;
  

  onPageChange(page: number) {
    this.CurrentPage = page;
    
  }


  ///chart
  // النوع لازم يبقى ChartType مش ثابت "line"
  public lineChartType: ChartType = 'line';

  // البيانات
  public lineChartData: ChartConfiguration['data'] = {
    labels: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
    datasets: [
      {
        data: [500, 50, 1420, 100, 1750, 1900, 200, 2100, 180, 1000, 10, 1500],
        label: 'Revenue',
        borderColor: this.getCssVariableValue('--bg-brown-medium'),
        backgroundColor: (context:any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          return '#7d6e59'; // fallback لو chartArea مش متاح لسه
        }

        // نعمل Gradient عمودي
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);

        gradient.addColorStop(0, 'rgba(125, 110, 89, 0.35)'); // لون بني غامق عند الخط
        gradient.addColorStop(1, 'rgba(125, 110, 89, 0)');    // شفاف تحت

        return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: this.getCssVariableValue('--bg-brown-medium'),
        pointBorderWidth: 3,
        pointRadius: 5
      }
    ]
  };

  // الإعدادات
  public lineChartOptions: ChartOptions = {
    responsive: true,
  maintainAspectRatio: false, // يخلي الرسم ياخد 100% width & height
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        autoSkip: false,     // يخلي كل label يظهر
        maxRotation: 0,      // يمنع لف النصوص
        minRotation: 0
      }
    },
    y: {
      beginAtZero: true
    }
  }
  };

  getCssVariableValue(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }


  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.clinicId = this.route.parent?.snapshot.paramMap.get('id');
    console.log('Child Clinic ID from parent:', this.clinicId);
  }

  changeRange(range: string) {
  this.selectedRange = range;
  if (range === 'Daily') {
    this.totalRevenue = '3,500 SAR';
  } else if (range === 'Weekly') {
    this.totalRevenue = '22,000 SAR';
  } else {
    this.totalRevenue = '85,000 SAR';
  }
}

}
