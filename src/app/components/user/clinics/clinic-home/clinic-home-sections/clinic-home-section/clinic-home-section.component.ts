import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { Chart, registerables } from 'chart.js'; // Import chart.js
import { PaginationComponent } from '../../../../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ModalComponent } from '../../../../../shared/modal/modal.component';
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
    PaginationComponent,
    ModalComponent,
  ],
  templateUrl: './clinic-home-section.component.html',
  styleUrl: './clinic-home-section.component.scss',
})
export class ClinicHomeSectionComponent implements AfterViewInit {
  clinicId!: any;
  selectedRange = 'Monthly';
  totalRevenue = '85,000 SAR';
  fromDate!: Date | null;
  toDate!: Date | null;
  CurrentPage = 1;
  isViewMaterialModalOpen = false;
  isViewDoctorsModalOpen = false;

  openViewMaterialModal() {
    this.isViewMaterialModalOpen = true;
  }

  openViewDoctorsModal() {
    this.isViewDoctorsModalOpen = true;
  }

  closeViewMaterialModal() {
    this.isViewMaterialModalOpen = false;
  }

  closeViewDoctorsModal() {
    this.isViewDoctorsModalOpen = false;
  }

  onPageChange(page: number) {
    this.CurrentPage = page;
  }

  public lineChartData = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Revenue',
        data: [1000, 10, 1420, 100, 1750, 1900, 200, 2100, 180, 1000, 10, 1500],
        fill: true,
        borderColor: 'rgba(125, 110, 89, 1)',
        backgroundColor: 'rgba(125, 110, 89, 0.35)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(125, 110, 89, 1)',
        pointBorderWidth: 0,
        pointRadius: 0,
      },
    ],
  };

  public lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { autoSkip: false, maxRotation: 0, minRotation: 0 },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { display: false },
      },
    },
  };

  getCssVariableValue(varName: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  constructor(private route: ActivatedRoute) {
    Chart.register(...registerables);
  }

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

  ngAfterViewInit() {
    // Create the chart after the view is initialized
    new Chart('lineChart', {
      type: 'line', // Chart type: 'line' in this case
      data: this.lineChartData,
      options: this.lineChartOptions,
    });
  }
}
