import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-view-dental-history-details',
  standalone: true,
  imports: [TranslateModule,
    MatIconModule
  ],
  templateUrl: './view-dental-history-details.component.html',
  styleUrl: '../../patients/patient-list/patient-profile/patient-profile/patient-profile-sections/dental-history/dental-history.component.scss'
})
export class ViewDentalHistoryDetailsComponent implements OnInit{

  

  patientId!: number;

  constructor(private _ActivatedRoute: ActivatedRoute, private _Router: Router) {
    
  }
  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe(params => {
      this.patientId = params['patientId'];
    });
    console.log(this.patientId)
  }

  goBack() {
    this._Router.navigate([`/dashboard/patients/${this.patientId}/dental-history`]);
  }

    cases = { id: 1 , diagnosis: 'Start root canal treatment', complete: 70 };

}
