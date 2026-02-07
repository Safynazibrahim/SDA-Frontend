import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ClinicFeaturesService } from '../../../core/services/clinic-features.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-clinic-home',
  standalone: true,
  imports: [CommonModule,RouterModule,MatIconModule,TranslateModule,
    MatTooltipModule,ScrollingModule],
  templateUrl: './clinic-home.component.html',
  styleUrl: './clinic-home.component.scss'
})
export class ClinicHomeComponent implements OnInit{

  clinicId!: string;
  isClosed = false;
  isMobile = false;
managementOpen = false;



  constructor(private route: ActivatedRoute,private router: Router,
    public featureService: ClinicFeaturesService
  ){
     this.router.events.subscribe(() => {
  this.managementOpen = this.router.url.includes("management");
});

  }

  ngOnInit(): void {
    this.checkScreenSize();

    this.route.paramMap.subscribe(params => {
      this.clinicId = params.get('id')!;
      console.log('clinicId in parent', this.clinicId);
    });
  }

@HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      this.isClosed = true; // Force closed for mobile
    } else if (!this.isMobile && this.isClosed) {
      // Reopen if returning to tablet/desktop
      this.isClosed = false;
    }
  }

  toggleSidebar() {
    if (!this.isMobile) {
      this.isClosed = !this.isClosed;
    }
  }

  backToClinics(){
    this.router.navigate(['/dashboard/clinics']);
  }
  toggleManagement() {
  this.managementOpen = !this.managementOpen;
}


}
