import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-clinic-home',
  standalone: true,
  imports: [CommonModule,RouterModule,MatIconModule,TranslateModule,],
  templateUrl: './clinic-home.component.html',
  styleUrl: './clinic-home.component.scss'
})
export class ClinicHomeComponent implements OnInit{
  clinicId!: string;
  isClosed = false;

  constructor(private route: ActivatedRoute,private router: Router){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clinicId = params.get('id')!;
      console.log('clinicId in parent', this.clinicId);
    });
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }

  backToClinics(){
    this.router.navigate(['/dashboard/clinics']);
  }

}
