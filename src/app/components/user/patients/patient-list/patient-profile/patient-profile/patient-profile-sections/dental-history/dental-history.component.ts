import { routes } from './../../../../../../../../app.routes';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dental-history',
  standalone: true,
  imports: [TranslateModule,
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    ],
  templateUrl: './dental-history.component.html',
  styleUrl: './dental-history.component.scss'
})
export class DentalHistoryComponent implements OnInit{

  patientId!: any;
  fromDate!: Date | null;
  toDate!: Date | null;

  constructor(private _Router:Router,private _ActivatedRoute: ActivatedRoute){}
  ngOnInit(): void {
    this.patientId = this._ActivatedRoute.parent?.snapshot.paramMap.get('id');
    console.log('Child Clinic ID from parent:', this.patientId);
    console.log('dental history');
  }

  cases = [
  { id: 1 , diagnosis: 'Start root canal treatment', complete: 70 },
  { id: 2 , diagnosis: 'Crown preparation', complete: 50 },
  { id: 3 , diagnosis: 'Start root canal treatment', complete: 25 },
  { id: 4 , diagnosis: 'Start root canal treatment', complete: 10 },
  { id: 5 , diagnosis: 'Crown preparation', complete: 95 }
  ];

  goToDetails(caseId:number){
    this._Router.navigate([`/dashboard/view-dental-history-details/${caseId}`], {
    queryParams: { patientId: this.patientId },
  });
  }

}
