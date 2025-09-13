import { Component } from '@angular/core';
import { ProfileComponent } from "../profile/profile.component";
import { RouterOutlet } from "../../../../../node_modules/@angular/router/index";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProfileComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
