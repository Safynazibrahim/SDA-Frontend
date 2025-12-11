import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ClinicService } from '../../../../clinic.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clinic-doctors',
  standalone: true,
  imports: [],
  templateUrl: './clinic-doctors.component.html',
  styleUrl: './clinic-doctors.component.scss'
})
export class ClinicDoctorsComponent implements OnInit {
  clinicId: string =''; 
  page: number = 1;
  limit: number = 10; 
doctors:any;
  constructor(private clinicService: ClinicService , private route: ActivatedRoute) {}

  ngOnInit() {
    
     this.clinicId = this.route.parent?.parent?.snapshot.paramMap.get('id') || '';
    console.log("DONIA ID: ",this.clinicId);
    this.loadDoctors();
    
  }

  loadDoctors() {
    if(this.clinicId){
    this.clinicService.getDoctorsForClinic(this.clinicId, this.page,this.limit).subscribe((response) => {
      this.doctors = response.data;
      console.log("Doctors: ",this.doctors);
    });
  }
  }

}
